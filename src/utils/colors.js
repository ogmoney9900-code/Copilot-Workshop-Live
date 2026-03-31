import chalk from 'chalk';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Wraps a task status value in the appropriate chalk color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status ('todo', 'in-progress', or 'done').
 * @returns {string} The status string wrapped in chalk color codes.
 * @throws {TypeError} If status is not one of 'todo', 'in-progress', or 'done'.
 * @example
 * colorStatus('done');        // returns green-colored 'done'
 * colorStatus('in-progress'); // returns yellow-colored 'in-progress'
 */
export function colorStatus(status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new TypeError(`Invalid status '${status}'. Expected: ${VALID_STATUSES.join(', ')}.`);
  }
  switch (status) {
    case 'done':        return chalk.green(status);
    case 'in-progress': return chalk.yellow(status);
    case 'todo':        return chalk.red(status);
  }
}

/**
 * Wraps a task priority value in the appropriate chalk style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim text
 * @param {string} priority - The task priority ('low', 'medium', or 'high').
 * @returns {string} The priority string wrapped in chalk style codes.
 * @throws {TypeError} If priority is not one of 'low', 'medium', or 'high'.
 * @example
 * colorPriority('high');   // returns bold red 'high'
 * colorPriority('low');    // returns dim 'low'
 */
export function colorPriority(priority) {
  if (!VALID_PRIORITIES.includes(priority)) {
    throw new TypeError(`Invalid priority '${priority}'. Expected: ${VALID_PRIORITIES.join(', ')}.`);
  }
  switch (priority) {
    case 'high':   return chalk.bold.red(priority);
    case 'medium': return chalk.bold.yellow(priority);
    case 'low':    return chalk.dim(priority);
  }
}
