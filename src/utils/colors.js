import chalk from 'chalk';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Returns the task status string wrapped in the appropriate chalk color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status value ('todo', 'in-progress', or 'done').
 * @returns {string} The chalk-colored status string.
 * @throws {TypeError} If status is not one of 'todo', 'in-progress', or 'done'.
 * @example
 * colorStatus('done');        // green 'done'
 * colorStatus('in-progress'); // yellow 'in-progress'
 */
export function colorStatus(status) {
  if (typeof status !== 'string' || status.trim().length === 0) {
    throw new TypeError(`status must be a non-empty string.`);
  }
  const normalized = status.trim();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new TypeError(`Invalid status '${normalized}'. Expected: ${VALID_STATUSES.join(', ')}.`);
  }
  switch (normalized) {
    case 'done':        return chalk.green(normalized);
    case 'in-progress': return chalk.yellow(normalized);
    case 'todo':        return chalk.red(normalized);
    default:            throw new TypeError(`Invalid status '${normalized}'. Expected: ${VALID_STATUSES.join(', ')}.`);
  }
}

/**
 * Returns the task priority string wrapped in the appropriate chalk style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim
 * @param {string} priority - The task priority value ('low', 'medium', or 'high').
 * @returns {string} The chalk-styled priority string.
 * @throws {TypeError} If priority is not one of 'low', 'medium', or 'high'.
 * @example
 * colorPriority('high');   // bold red 'high'
 * colorPriority('low');    // dim 'low'
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string' || priority.trim().length === 0) {
    throw new TypeError(`priority must be a non-empty string.`);
  }
  const normalized = priority.trim();
  if (!VALID_PRIORITIES.includes(normalized)) {
    throw new TypeError(`Invalid priority '${normalized}'. Expected: ${VALID_PRIORITIES.join(', ')}.`);
  }
  switch (normalized) {
    case 'high':   return chalk.bold.red(normalized);
    case 'medium': return chalk.bold.yellow(normalized);
    case 'low':    return chalk.dim(normalized);
    default:       throw new TypeError(`Invalid priority '${normalized}'. Expected: ${VALID_PRIORITIES.join(', ')}.`);
  }
}
