/**
 * Asserts that a value is a non-empty string after trimming whitespace.
 * @param {*} value - The value to check.
 * @param {string} fieldName - Name of the field, used in the error message.
 * @throws {TypeError} If value is not a non-empty string.
 * @example
 * assertNonEmptyString('hello', 'title');  // ok
 * assertNonEmptyString('  ', 'title');     // throws TypeError: "Title is required."
 */
export function assertNonEmptyString(value, fieldName) {
  if (typeof fieldName !== 'string' || fieldName.trim().length === 0) {
    throw new TypeError('fieldName must be a non-empty string.');
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    throw new TypeError(`${label} is required.`);
  }
}

/**
 * Asserts that a value is one of the allowed enum values.
 * @param {*} value - The value to check.
 * @param {string} fieldName - Name of the field, used in the error message.
 * @param {string[]} allowed - Array of valid string values.
 * @throws {TypeError} If allowed is not an array, or value is not in allowed.
 * @example
 * assertEnum('done', 'status', ['todo', 'in-progress', 'done']);   // ok
 * assertEnum('closed', 'status', ['todo', 'in-progress', 'done']); // throws TypeError
 */
export function assertEnum(value, fieldName, allowed) {
  if (!Array.isArray(allowed)) {
    throw new TypeError('allowed must be an array.');
  }
  if (typeof fieldName !== 'string' || fieldName.trim().length === 0) {
    throw new TypeError('fieldName must be a non-empty string.');
  }
  if (!allowed.includes(value)) {
    throw new TypeError(`Invalid ${fieldName} '${value}'. Expected: ${allowed.join(', ')}.`);
  }
}

/**
 * Asserts that a value is a positive integer (>= 1).
 * @param {*} value - The value to check.
 * @param {string} fieldName - Name of the field, used in the error message.
 * @throws {TypeError} If value is not a positive integer.
 * @example
 * assertPositiveInt(5, 'id');    // ok
 * assertPositiveInt(-1, 'id');   // throws TypeError: "id must be a positive integer."
 */
export function assertPositiveInt(value, fieldName) {
  if (typeof fieldName !== 'string' || fieldName.trim().length === 0) {
    throw new TypeError('fieldName must be a non-empty string.');
  }
  if (!Number.isInteger(value) || value < 1) {
    throw new TypeError(`${fieldName} must be a positive integer.`);
  }
}
