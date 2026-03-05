# Implementation Plan: Documentation & Tool Alignment

This plan outlines the steps required to align the ClickUp MCP Server's documentation (`docs/DOCUMENTATION.md`) with its actual behavior and to resolve minor functional inconsistencies identified during systematic testing.

## Overview
**Date:** March 1, 2026  
**Status:** Draft  
**Goal:** Achieve 100% accuracy between documented features and tool implementation.

---

## Phase 1: Documentation Cleanup (Immediate)
*Target: docs/DOCUMENTATION.md*

### 1.1 Priority Parameter Normalization
*   **Change:** Update all tables and examples to specify that `priority` should be provided as a **string** ("1", "2", "3", "4") rather than a number.
*   **Rationale:** `update_task` and `update_bulk_tasks` currently fail when passed numeric values, despite `create_task` accepting them.
*   **Affected Sections:** Task Management, Examples, Bulk Operations.

### 1.2 Tag Case Sensitivity
*   **Change:** Remove claims that "Tag names are case-sensitive."
*   **Add:** "Note: ClickUp normalizes all tags to lowercase. While the server handles case-insensitive lookups where possible, it is recommended to use lowercase strings for consistency."
*   **Affected Sections:** Tag Management, Important Notes.

### 1.3 Time Tracking - Natural Language Clarification
*   **Change:** Refine the "Natural Language Date Support" section.
*   **Add:** "Note: While many natural language expressions are supported, manual time entries (`add_time_entry`) are most reliable with simple relative dates (e.g., 'today', 'yesterday') or Unix timestamps. Specific time-of-day strings (e.g., '10am today') may vary in support across tools."
*   **Affected Sections:** Time Tracking Parameters, Natural Language Date Support.

---

## Phase 2: Code Alignment (Structural)
*Target: src/services/clickup/ and src/tools/*

### 2.1 Priority Type Coercion
*   **Task:** Update the schema and parameter processing in `update_task` and `update_bulk_tasks` to automatically coerce numeric priority values to strings.
*   **Goal:** Allow both `2` and `"2"` to work identically across all task operations.

### 2.2 Tag Resolution & Normalization (Fuzzy Matching)
*   **Task:** Refactor `add_tag_to_task` to use the existing `findBestMatchInArray` utility from `resolver-utils.ts` to find the correct tag in the space before adding it.
*   **Goal:** Enable fuzzy matching, emoji-handling, and case-insensitivity when adding tags. This prevents "Tag not found" errors when a user provides a slightly different name or casing than what exists in ClickUp.

### 2.3 Bulk Delete Response Improvement
*   **Task:** Refine the `delete_bulk_tasks` handler to return the original task identifiers (Name/ID) in the `successful` array instead of `null`.
*   **Goal:** Provide better feedback for automated agents to confirm which tasks were processed.

### 2.4 Critical API Routing Fixes
*   **Task 1 (get_folder):** Debug the "fetch failed" error. Investigate if the ClickUp API endpoint requires additional parameters or if the URL construction is incorrect.
*   **Task 2 (list_documents):** Investigate why `parent_type: 'SPACE'` triggers a fetch failure while `WORKSPACE` works. Check for permission scopes or ID formatting requirements.
*   **Task 3 (remove_task_from_list):** Diagnose the "Resource not found" error. Verify the endpoint and ensure the task/list association is correctly identified.
*   **Goal:** Restore functionality to currently non-functional tools.

---

## Phase 3: Verification & Validation
*Target: Comprehensive Regression Testing*

### 3.1 Automated Test Suite
*   Update existing unit tests in `src/tools/task/__tests__` (if applicable) to include:
    *   Numeric vs. String priority tests for updates.
    *   Fuzzy tag resolution tests (emojis, casing, substring).
    *   Natural language date parsing edge cases.

### 3.2 Manual Smoke Test
*   Re-run the documentation verification script to ensure all "Inaccurate" or "Ambiguous" findings from the March 1st report are now "Accurate."
*   Verify that "fetch failed" tools now return valid data.

---

## Success Criteria
1.  `docs/DOCUMENTATION.md` contains no contradictory information compared to tool behavior.
2.  `update_task` succeeds with numeric priority values.
3.  `add_tag_to_task` succeeds with fuzzy matching (casing, emojis, typos).
4.  `get_folder` and `list_documents` (Space) return valid data instead of "fetch failed".
5.  All bulk operation responses provide high-signal feedback (no `null` successes).
