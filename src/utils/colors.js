import chalk from 'chalk';

/**
 * Returns the task status string wrapped in the appropriate chalk color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status value ('todo', 'in-progress', or 'done').
 * @returns {string} The chalk-colored status string.
 * @throws {TypeError} If status is not a non-empty string.
 * @example
 * colorStatus('done');        // green 'done'
 * colorStatus('in-progress'); // yellow 'in-progress'
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
 * Returns the task priority string wrapped in the appropriate chalk style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim
 * @param {string} priority - The task priority value ('low', 'medium', or 'high').
 * @returns {string} The chalk-styled priority string.
 * @throws {TypeError} If priority is not a non-empty string.
 * @example
 * colorPriority('high');   // bold red 'high'
 * colorPriority('low');    // dim 'low'
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
