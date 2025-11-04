/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expectedHeader = `Copyright (c) Meta Platforms, Inc. and affiliates.

This source code is licensed under the Apache 2.0 license found in the
LICENSE file in the root directory of this source tree.`;

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function extractCommentText(comment) {
  let text = comment.value;

  // Remove leading/trailing whitespace and asterisks from block comments
  if (comment.type === 'Block') {
    text = text
      .split('\n')
      .map(line => line.replace(/^\s*\*?\s?/, '').replace(/\s*\*?\s*$/, ''))
      .join('\n')
      .trim();
  }

  return text;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce copyright header in all files',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingHeader: 'File is missing the required copyright header',
      incorrectHeader: 'Copyright header does not match the required format',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const comments = sourceCode.getAllComments();

    return {
      Program(node) {
        // Check if there are any comments at the beginning of the file
        if (comments.length === 0) {
          context.report({
            node,
            messageId: 'missingHeader',
            fix(fixer) {
              const headerComment = `/**\n * ${expectedHeader.split('\n').join('\n * ')}\n */\n\n`;
              return fixer.insertTextBefore(node, headerComment);
            },
          });
          return;
        }

        // Check the first comment for the copyright header
        const firstComment = comments[0];
        const commentText = extractCommentText(firstComment);

        // Normalize whitespace for comparison
        const normalizedComment = normalizeWhitespace(commentText);
        const normalizedExpected = normalizeWhitespace(expectedHeader);

        if (!normalizedComment.includes(normalizedExpected)) {
          context.report({
            node: firstComment,
            messageId: 'incorrectHeader',
            fix(fixer) {
              const headerComment = `/**\n * ${expectedHeader.split('\n').join('\n * ')}\n */`;

              // If the first comment is at the very beginning, replace it
              if (
                firstComment.range[0] === 0 ||
                (firstComment.range[0] <= 10 &&
                  sourceCode
                    .getText()
                    .slice(0, firstComment.range[0])
                    .trim() === '')
              ) {
                return fixer.replaceText(firstComment, headerComment);
              } else {
                // Insert at the beginning of the file
                return fixer.insertTextBefore(node, headerComment + '\n\n');
              }
            },
          });
        }
      },
    };
  },
};
