import chalk from 'chalk';

/**
 * Wraps a task status value in the appropriate chalk color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status ('todo', 'in-progress', or 'done').
 * @returns {string} The status string wrapped in chalk color codes.
 * @throws {TypeError} If status is not a non-empty string.
 * @example
 * colorStatus('done');        // returns green-colored 'done'
 * colorStatus('in-progress'); // returns yellow-colored 'in-progress'
 */
export function colorStatus(status) {
  if (typeof status !== 'string' || status.trim().length === 0) {
    throw new TypeError('status must be a non-empty string.');
  }
  switch (status) {
    case 'done':        return chalk.green(status);
    case 'in-progress': return chalk.yellow(status);
    case 'todo':        return chalk.red(status);
    default:            return status;
  }
}

/**
 * Wraps a task priority value in the appropriate chalk style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim text
 * @param {string} priority - The task priority ('low', 'medium', or 'high').
 * @returns {string} The priority string wrapped in chalk style codes.
 * @throws {TypeError} If priority is not a non-empty string.
 * @example
 * colorPriority('high');   // returns bold red 'high'
 * colorPriority('low');    // returns dim 'low'
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string' || priority.trim().length === 0) {
    throw new TypeError('priority must be a non-empty string.');
  }
  switch (priority) {
    case 'high':   return chalk.bold.red(priority);
    case 'medium': return chalk.bold.yellow(priority);
    case 'low':    return chalk.dim(priority);
    default:       return priority;
  }
}
