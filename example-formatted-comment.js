#!/usr/bin/env node

/**
 * Example demonstrating the new formatted comment feature
 */

// Example formatted comment with various formatting options (matches ClickUp API exactly)
const formattedCommentExample = [
  {
    text: "This is a formatted comment with "
  },
  {
    text: "bold text",
    attributes: {
      bold: true
    }
  },
  {
    text: " and "
  },
  {
    text: "italic text",
    attributes: {
      italic: true
    }
  },
  {
    text: ". I need someone to look at this comment. Maybe "
  },
  {
    type: "tag",
    user: {
      id: 1234567 // Replace with actual ClickUp user ID
    }
  },
  {
    text: " if you have time to check this out. Here's a "
  },
  {
    text: "link to our docs",
    attributes: {
      link: "https://clickup.com/api"
    }
  },
  {
    text: ".\n\nHere's a code block:"
  },
  {
    type: "code_block",
    text: "console.log('Hello, ClickUp!');",
    language: "javascript"
  },
  {
    text: "\n\nAnd a bulleted list:"
  },
  {
    type: "bulleted_list",
    items: [
      {
        text: "First item"
      },
      {
        text: "Second item with bold text",
        attributes: {
          bold: true
        }
      },
      {
        text: "Third item with a link",
        attributes: {
          link: "https://example.com"
        }
      }
    ]
  },
  {
    text: "\n\nAnd a checklist:"
  },
  {
    type: "checklist",
    items: [
      {
        text: "Completed task",
        checked: true
      },
      {
        text: "Pending task",
        checked: false
      }
    ]
  },
  {
    text: "\n\nAnd an emoji: "
  },
  {
    type: "emoji",
    unicode: "1F44D" // 👍
  },
  {
    text: " Thanks!"
  }
];

console.log("Example formatted comment structure:");
console.log(JSON.stringify(formattedCommentExample, null, 2));

console.log("\n\nTo use this with the MCP server, you would call:");
console.log("create_task_comment with the 'formattedComment' parameter instead of 'commentText'");

console.log("\n\nFor plain text comments, you can still use the 'commentText' parameter as before.");