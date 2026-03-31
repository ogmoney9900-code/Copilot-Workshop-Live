const ANSI_STYLES = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m'
};

/**
 * Applies one or more ANSI styles to the given text.
 * This is an internal helper to avoid external color libraries.
 *
 * @param {string} text - The text to style.
 * @param {string[]} styleKeys - Array of style keys from ANSI_STYLES.
 * @returns {string} The ANSI-styled text.
 */
function applyAnsiStyles(text, styleKeys) {
  const prefix = styleKeys
    .map((key) => ANSI_STYLES[key])
    .filter((code) => typeof code === 'string')
    .join('');

  if (prefix.length === 0) {
    return text;
  }

  return prefix + text + ANSI_STYLES.reset;
}

/**
 * Returns the task status string wrapped in the appropriate ANSI color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status value ('todo', 'in-progress', or 'done').
 * @returns {string} The ANSI-colored status string.
 * @throws {TypeError} If status is not a non-empty string or is an unsupported value.
 * @example
 * colorStatus('done');        // green 'done'
 * colorStatus('in-progress'); // yellow 'in-progress'
 * @example
 * colorStatus('todo');        // red 'todo'
 */
export function colorStatus(status) {
  if (typeof status !== 'string' || status.trim().length === 0) {
    throw new TypeError('status must be a non-empty string.');
  }

  switch (status) {
    case 'done':
      return applyAnsiStyles(status, ['green']);
    case 'in-progress':
      return applyAnsiStyles(status, ['yellow']);
    case 'todo':
      return applyAnsiStyles(status, ['red']);
    default:
      throw new TypeError(`Unsupported status value: '${status}'.`);
  }
}

/**
 * Returns the task priority string wrapped in the appropriate ANSI style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim
 * @param {string} priority - The task priority value ('low', 'medium', or 'high').
 * @returns {string} The ANSI-styled priority string.
 * @throws {TypeError} If priority is not a non-empty string or is an unsupported value.
 * @example
 * colorPriority('high');   // bold red 'high'
 * colorPriority('low');    // dim 'low'
 * @example
 * colorPriority('medium'); // bold yellow 'medium'
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string' || priority.trim().length === 0) {
    throw new TypeError('priority must be a non-empty string.');
  }

  switch (priority) {
    case 'high':
      return applyAnsiStyles(priority, ['bold', 'red']);
    case 'medium':
      return applyAnsiStyles(priority, ['bold', 'yellow']);
    case 'low':
      return applyAnsiStyles(priority, ['dim']);
    default:
      throw new TypeError(`Unsupported priority value: '${priority}'.`);
  }
}
