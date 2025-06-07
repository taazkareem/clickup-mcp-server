/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Base ClickUp Service Class
 * 
 * This class provides core functionality for all ClickUp service modules:
 * - Axios client configuration
 * - Rate limiting and request throttling
 * - Error handling
 * - Common request methods
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Logger, LogLevel } from '../../logger.js';

/**
 * Basic service response interface
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  }
}

/**
 * Error types for better error handling
 */
export enum ErrorCode {
  RATE_LIMIT = 'rate_limit_exceeded',
  NOT_FOUND = 'resource_not_found',
  UNAUTHORIZED = 'unauthorized',
  VALIDATION = 'validation_error',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  WORKSPACE_ERROR = 'workspace_error',
  INVALID_PARAMETER = 'invalid_parameter',
  UNKNOWN = 'unknown_error'
}

/**
 * Custom error class for ClickUp API errors
 */
export class ClickUpServiceError extends Error {
  readonly code: ErrorCode;
  readonly data?: any;
  readonly status?: number;
  context?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    data?: any,
    status?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ClickUpServiceError';
    this.code = code;
    this.data = data;
    this.status = status;
    this.context = context;
  }
}

/**
 * Rate limit response headers from ClickUp API
 */
interface RateLimitHeaders {
  'x-ratelimit-limit': number;
  'x-ratelimit-remaining': number;
  'x-ratelimit-reset': number;
}

/**
 * Helper function to safely parse JSON
 * @param data Data to parse
 * @param fallback Optional fallback value if parsing fails
 * @returns Parsed JSON or fallback value
 */
function safeJsonParse(data: any, fallback: any = undefined): any {
  if (typeof data !== 'string') {
    return data;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    return fallback;
  }
}

/**
 * Base ClickUp service class that handles common functionality
 */
export class BaseClickUpService {
  protected apiKey: string;
  protected teamId: string;
  protected readonly client: AxiosInstance;
  protected readonly logger: Logger;
  
  protected readonly defaultRequestSpacing = 600; // Default milliseconds between requests
  protected readonly rateLimit = 100; // Maximum requests per minute (Free Forever plan)
  protected requestSpacing: number; // Current request spacing, can be adjusted
  protected readonly timeout = 65000; // 65 seconds (safely under the 1-minute window)
  protected requestQueue: (() => Promise<any>)[] = [];
  protected processingQueue = false;
  protected lastRateLimitReset: number = 0;

  /**
   * Creates an instance of BaseClickUpService.
   * @param apiKey - ClickUp API key for authentication (defaults to empty for security)
   * @param teamId - ClickUp team ID for targeting the correct workspace (defaults to empty for security)
   * @param baseUrl - Optional custom base URL for the ClickUp API
   */
  constructor(apiKey: string = '', teamId: string = '', baseUrl: string = 'https://api.clickup.com/api/v2') {
    this.apiKey = apiKey;
    this.teamId = teamId;
    this.requestSpacing = this.defaultRequestSpacing;
    
    // Create a logger with the actual class name for better context
    const className = this.constructor.name;
    this.logger = new Logger(`ClickUp:${className}`);

    // Configure the Axios client with default settings
    // Only set Authorization header if apiKey is provided
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (apiKey) {
      headers['Authorization'] = apiKey;
    }

    this.client = axios.create({
      baseURL: baseUrl,
      headers,
      timeout: this.timeout,
      transformResponse: [
        // Add custom response transformer to handle both JSON and text responses
        (data: any) => {
          if (!data) return data;
          
          // If it's already an object, return as is
          if (typeof data !== 'string') return data;
          
          // Try to parse as JSON, fall back to raw text if parsing fails
          const parsed = safeJsonParse(data, null);
          return parsed !== null ? parsed : data;
        }
      ]
    });

    this.logger.debug(`Initialized ${className}`, { teamId, baseUrl });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleAxiosError(error)
    );
  }

  /**
   * Handle errors from Axios requests
   * @private
   * @param error Error from Axios
   * @returns Never - always throws an error
   */
  private handleAxiosError(error: any): never {
    // Determine error details
    const status = error.response?.status;
    const responseData = error.response?.data;
    const errorMsg = responseData?.err || responseData?.error || error.message || 'Unknown API error';
    const path = error.config?.url || 'unknown path';
    
    // Context object for providing more detailed log information
    const errorContext: {
      path: string;
      status: number | undefined;
      method: string;
      requestData: any;
      rateLimitInfo?: {
        limit: number;
        remaining: number;
        reset: number;
        timeToReset: number;
      };
    } = {
      path,
      status,
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      requestData: error.config?.data ? safeJsonParse(error.config.data, error.config.data) : undefined
    };

    // Pick the appropriate error code based on status
    let code: ErrorCode;
    let logMessage: string;
    let errorMessage: string;

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      code = ErrorCode.NETWORK_ERROR;
      logMessage = `Request timeout for ${path}`;
      errorMessage = 'Request timed out. Please try again.';
    } else if (!error.response) {
      code = ErrorCode.NETWORK_ERROR;
      logMessage = `Network error accessing ${path}: ${error.message}`;
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (status === 429) {
      code = ErrorCode.RATE_LIMIT;
      this.handleRateLimitHeaders(error.response.headers);
      
      // Calculate time until reset
      const reset = error.response.headers['x-ratelimit-reset'];
      const now = Date.now() / 1000; // Convert to seconds
      const timeToReset = Math.max(0, reset - now);
      const resetMinutes = Math.ceil(timeToReset / 60);
      
      logMessage = `Rate limit exceeded for ${path}`;
      errorMessage = `Rate limit exceeded. Please wait ${resetMinutes} minute${resetMinutes === 1 ? '' : 's'} before trying again.`;
      
      // Add more context to the error
      errorContext.rateLimitInfo = {
        limit: error.response.headers['x-ratelimit-limit'],
        remaining: error.response.headers['x-ratelimit-remaining'],
        reset: reset,
        timeToReset: timeToReset
      };
    } else if (status === 401 || status === 403) {
      code = ErrorCode.UNAUTHORIZED;
      logMessage = `Authorization failed for ${path}`;
      errorMessage = 'Authorization failed. Please check your API key.';
    } else if (status === 404) {
      code = ErrorCode.NOT_FOUND;
      logMessage = `Resource not found: ${path}`;
      errorMessage = 'Resource not found.';
    } else if (status >= 400 && status < 500) {
      code = ErrorCode.VALIDATION;
      logMessage = `Validation error for ${path}: ${errorMsg}`;
      errorMessage = errorMsg;
    } else if (status >= 500) {
      code = ErrorCode.SERVER_ERROR;
      logMessage = `ClickUp server error: ${errorMsg}`;
      errorMessage = 'ClickUp server error. Please try again later.';
    } else {
      code = ErrorCode.UNKNOWN;
      logMessage = `Unknown API error: ${errorMsg}`;
      errorMessage = 'An unexpected error occurred. Please try again.';
    }

    // Log the error with context
    this.logger.error(logMessage, errorContext);

    // Throw a formatted error with user-friendly message
    throw new ClickUpServiceError(errorMessage, code, error);
  }

  /**
   * Handle rate limit headers from ClickUp API
   * @private
   * @param headers Response headers from ClickUp
   */
  private handleRateLimitHeaders(headers: any): void {
    try {
      // Parse the rate limit headers
      const limit = headers['x-ratelimit-limit'];
      const remaining = headers['x-ratelimit-remaining'];
      const reset = headers['x-ratelimit-reset'];
      
      // Only log if we're getting close to the limit
      if (remaining < limit * 0.2) {
        this.logger.warn('Approaching rate limit', { remaining, limit, reset });
      } else {
        this.logger.debug('Rate limit status', { remaining, limit, reset });
      }

      if (reset) {
        this.lastRateLimitReset = reset;
        
        // If reset is in the future, calculate a safe request spacing
        const now = Date.now();
        const resetTime = reset * 1000; // convert to milliseconds
        const timeToReset = Math.max(0, resetTime - now);
        
        // Proactively adjust spacing when remaining requests get low
        // This helps avoid hitting rate limits in the first place
        if (remaining < limit * 0.3) {
          // More aggressive spacing when close to limit
          let safeSpacing;
          
          if (remaining <= 5) {
            // Very aggressive spacing for last few requests
            safeSpacing = Math.ceil((timeToReset / remaining) * 2);
            // Start processing in queue mode preemptively
            if (!this.processingQueue) {
              this.logger.info('Preemptively switching to queue mode (low remaining requests)', { 
                remaining, 
                limit 
              });
              this.processingQueue = true;
              this.processQueue().catch(err => {
                this.logger.error('Error processing request queue', err);
              });
            }
          } else if (remaining <= 20) {
            // More aggressive spacing
            safeSpacing = Math.ceil((timeToReset / remaining) * 1.5);
          } else {
            // Standard safe spacing with buffer
            safeSpacing = Math.ceil((timeToReset / remaining) * 1.1);
          }
          
          // Apply updated spacing, but with a reasonable maximum
          const maxSpacing = 5000; // 5 seconds max spacing
          const adjustedSpacing = Math.min(safeSpacing, maxSpacing);
          
          // Only adjust if it's greater than our current spacing
          if (adjustedSpacing > this.requestSpacing) {
            this.logger.debug(`Adjusting request spacing: ${this.requestSpacing}ms → ${adjustedSpacing}ms`, { 
              remaining, 
              timeToReset 
            });
            this.requestSpacing = adjustedSpacing;
          }
        }
      }
    } catch (error) {
      this.logger.warn('Failed to parse rate limit headers', error);
    }
  }

  /**
   * Process the request queue, respecting rate limits by spacing out requests
   * @private
   */
  private async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) {
      this.logger.debug('Queue empty, exiting queue processing mode');
      this.processingQueue = false;
      return;
    }

    const queueLength = this.requestQueue.length;
    this.logger.debug(`Processing request queue (${queueLength} items)`);

    const startTime = Date.now();
    try {
      // Take the first request from the queue
      const request = this.requestQueue.shift();
      if (request) {
        // Adjust delay based on queue size
        // Longer delays for bigger queues to prevent overwhelming the API
        let delay = this.requestSpacing;
        if (queueLength > 20) {
          delay = this.requestSpacing * 2;
        } else if (queueLength > 10) {
          delay = this.requestSpacing * 1.5;
        }
        
        // Wait for the calculated delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Run the request
        await request();
      }
    } catch (error) {
      if (error instanceof ClickUpServiceError && error.code === ErrorCode.RATE_LIMIT) {
        // If we still hit rate limits, increase the spacing
        this.requestSpacing = Math.min(this.requestSpacing * 1.5, 10000); // Max 10s
        this.logger.warn(`Rate limit hit during queue processing, increasing delay to ${this.requestSpacing}ms`);
      } else {
        this.logger.error('Error executing queued request', error);
      }
    } finally {
      const duration = Date.now() - startTime;
      this.logger.trace(`Queue item processed in ${duration}ms, ${this.requestQueue.length} items remaining`);
      
      // Continue processing the queue after the calculated delay
      setTimeout(() => this.processQueue(), this.requestSpacing);
    }
  }

  /**
   * Makes an API request with rate limiting.
   * @protected
   * @param fn - Function that executes the API request
   * @returns Promise that resolves with the result of the API request
   */
  protected async makeRequest<T>(fn: () => Promise<T>): Promise<T> {
    // Validate that credentials are set before making any API requests
    if (!this.apiKey || !this.teamId) {
      throw new ClickUpServiceError(
        'API credentials not configured. Please call updateCredentials() with valid API key and team ID before making requests.',
        ErrorCode.UNAUTHORIZED
      );
    }
    // If we're being rate limited, queue the request rather than executing immediately
    if (this.processingQueue) {
      const queuePosition = this.requestQueue.length + 1;
      const estimatedWaitTime = Math.ceil((queuePosition * this.requestSpacing) / 1000);
      
      this.logger.info('Request queued due to rate limiting', {
        queuePosition,
        estimatedWaitSeconds: estimatedWaitTime,
        currentSpacing: this.requestSpacing
      });

      return new Promise<T>((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            const result = await fn();
            resolve(result);
          } catch (error) {
            // Enhance error message with queue context if it's a rate limit error
            if (error instanceof ClickUpServiceError && error.code === ErrorCode.RATE_LIMIT) {
              const enhancedError = new ClickUpServiceError(
                `${error.message} (Request was queued at position ${queuePosition})`,
                error.code,
                error.data
              );
              reject(enhancedError);
            } else {
              reject(error);
            }
          }
        });
      });
    }

    // Track request metadata
    let requestMethod = 'unknown';
    let requestPath = 'unknown';
    let requestData: any = undefined;

    // Set up interceptor to capture request details
    const requestInterceptorId = this.client.interceptors.request.use(
      (config) => {
        // Capture request metadata
        requestMethod = config.method?.toUpperCase() || 'unknown';
        requestPath = config.url || 'unknown';
        requestData = config.data;
        return config;
      }
    );

    const startTime = Date.now();
    try {
      // Execute the request function
      const result = await fn();
      
      // Debug log for successful requests with timing information
      const duration = Date.now() - startTime;
      this.logger.debug(`Request completed successfully in ${duration}ms`, {
        method: requestMethod,
        path: requestPath,
        duration,
        responseType: result ? typeof result : 'undefined'
      });
      
      return result;
    } catch (error) {
      // If we hit a rate limit, start processing the queue
      if (error instanceof ClickUpServiceError && error.code === ErrorCode.RATE_LIMIT) {
        this.logger.warn('Rate limit reached, switching to queue mode', {
          reset: this.lastRateLimitReset,
          queueLength: this.requestQueue.length
        });
        
        if (!this.processingQueue) {
          this.processingQueue = true;
          this.processQueue().catch(err => {
            this.logger.error('Error processing request queue', err);
          });
        }

        // Queue this failed request and return a promise that will resolve when it's retried
        return new Promise<T>((resolve, reject) => {
          this.requestQueue.push(async () => {
            try {
              const result = await fn();
              resolve(result);
            } catch (retryError) {
              reject(retryError);
            }
          });
        });
      }

      // For other errors, just throw
      throw error;
    } finally {
      // Always remove the interceptor
      this.client.interceptors.request.eject(requestInterceptorId);
    }
  }

  /**
   * Gets the ClickUp team ID associated with this service instance
   * @returns The team ID
   */
  getTeamId(): string {
    return this.teamId;
  }

  /**
   * Updates the credentials for this service instance
   * This allows changing API key and team ID dynamically per request
   * @param apiKey - New ClickUp API key for authentication
   * @param teamId - New ClickUp team ID for targeting the correct workspace
   */
  updateCredentials(apiKey: string, teamId: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }
    if (!teamId || typeof teamId !== 'string') {
      throw new Error('Team ID must be a non-empty string');
    }

    this.apiKey = apiKey;
    this.teamId = teamId;
    
    this.client.defaults.headers['Authorization'] = apiKey;
  }

  /**
   * Helper method to log API operations
   * @protected
   * @param operation - Name of the operation being performed
   * @param details - Details about the operation
   */
  protected logOperation(operation: string, details: any): void {
    this.logger.info(`Operation: ${operation}`, details);
  }

  /**
   * Log detailed information about a request (path and payload)
   * For trace level logging only
   */
  protected traceRequest(method: string, url: string, data?: any): void {
    if (this.logger.isLevelEnabled(LogLevel.TRACE)) {
      this.logger.trace(`${method} ${url}`, {
        payload: data,
        teamId: this.teamId
      });
    }
  }
} 