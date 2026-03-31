const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const ANSI = {
  reset:      '\x1b[0m',
  green:      '\x1b[32m',
  yellow:     '\x1b[33m',
  red:        '\x1b[31m',
  boldRed:    '\x1b[1;31m',
  boldYellow: '\x1b[1;33m',
  dim:        '\x1b[2m',
};

/**
 * Wraps text in an ANSI color/style code.
 * @param {string} text - The text to style.
 * @param {string} style - A key from the ANSI map.
 * @returns {string} The styled text with reset appended.
 * @example
 * applyAnsi('done', 'green');   // '\x1b[32mdone\x1b[0m'
 * applyAnsi('high', 'boldRed'); // '\x1b[1;31mhigh\x1b[0m'
 */
function applyAnsi(text, style) {
  if (typeof text !== 'string' || text.length === 0) {
    throw new TypeError('text must be a non-empty string.');
  }
  if (!(style in ANSI)) {
    throw new TypeError(`style must be one of: ${Object.keys(ANSI).filter(k => k !== 'reset').join(', ')}.`);
  }
  return `${ANSI[style]}${text}${ANSI.reset}`;
}

/**
 * Returns the task status string wrapped in the appropriate ANSI color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status - The task status value ('todo', 'in-progress', or 'done').
 * @returns {string} The colored status string.
 * @throws {TypeError} If status is not one of 'todo', 'in-progress', or 'done'.
 * @example
 * colorStatus('done');        // green 'done'
 * colorStatus('in-progress'); // yellow 'in-progress'
 */
export function colorStatus(status) {
  if (typeof status !== 'string' || status.trim().length === 0) {
    throw new TypeError('status must be a non-empty string.');
  }
  const normalized = status.trim();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new TypeError(`Invalid status '${normalized}'. Expected: ${VALID_STATUSES.join(', ')}.`);
  }
  switch (normalized) {
    case 'done':        return applyAnsi(normalized, 'green');
    case 'in-progress': return applyAnsi(normalized, 'yellow');
    case 'todo':        return applyAnsi(normalized, 'red');
    default:            throw new TypeError(`Invalid status '${normalized}'. Expected: ${VALID_STATUSES.join(', ')}.`);
  }
}

/**
 * Returns the task priority string wrapped in the appropriate ANSI style.
 * - 'high'   → bold red
 * - 'medium' → bold yellow
 * - 'low'    → dim
 * @param {string} priority - The task priority value ('low', 'medium', or 'high').
 * @returns {string} The styled priority string.
 * @throws {TypeError} If priority is not one of 'low', 'medium', or 'high'.
 * @example
 * colorPriority('high');   // bold red 'high'
 * colorPriority('low');    // dim 'low'
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string' || priority.trim().length === 0) {
    throw new TypeError('priority must be a non-empty string.');
  }
  const normalized = priority.trim();
  if (!VALID_PRIORITIES.includes(normalized)) {
    throw new TypeError(`Invalid priority '${normalized}'. Expected: ${VALID_PRIORITIES.join(', ')}.`);
  }
  switch (normalized) {
    case 'high':   return applyAnsi(normalized, 'boldRed');
    case 'medium': return applyAnsi(normalized, 'boldYellow');
    case 'low':    return applyAnsi(normalized, 'dim');
    default:       throw new TypeError(`Invalid priority '${normalized}'. Expected: ${VALID_PRIORITIES.join(', ')}.`);
  }
}
