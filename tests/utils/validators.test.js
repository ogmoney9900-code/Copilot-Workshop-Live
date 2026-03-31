import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertNonEmptyString, assertEnum, assertPositiveInt } from '../../src/utils/validators.js';

// assertNonEmptyString
test('assertNonEmptyString passes with a valid string', () => {
  assert.doesNotThrow(() => assertNonEmptyString('hello', 'title'));
});

test('assertNonEmptyString throws TypeError for empty string', () => {
  assert.throws(() => assertNonEmptyString('', 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for whitespace-only string', () => {
  assert.throws(() => assertNonEmptyString('   ', 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for non-string value', () => {
  assert.throws(() => assertNonEmptyString(null, 'title'), TypeError);
});

test('assertNonEmptyString capitalises the field name in the error message', () => {
  assert.throws(
    () => assertNonEmptyString('', 'title'),
    { message: 'Title is required.' }
  );
});

test('assertNonEmptyString throws TypeError when fieldName is empty', () => {
  assert.throws(() => assertNonEmptyString('hello', ''), TypeError);
});

test('assertNonEmptyString throws TypeError when fieldName is not a string', () => {
  assert.throws(() => assertNonEmptyString('hello', 42), TypeError);
});

test('assertNonEmptyString throws TypeError for undefined value', () => {
  assert.throws(() => assertNonEmptyString(undefined, 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for number value', () => {
  assert.throws(() => assertNonEmptyString(42, 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for boolean value', () => {
  assert.throws(() => assertNonEmptyString(false, 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for object value', () => {
  assert.throws(() => assertNonEmptyString({}, 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for array value', () => {
  assert.throws(() => assertNonEmptyString(['hello'], 'title'), TypeError);
});

test('assertNonEmptyString throws TypeError for tab-and-newline-only string', () => {
  assert.throws(() => assertNonEmptyString('\t\n', 'title'), TypeError);
});

test('assertNonEmptyString passes for a very long valid string', () => {
  assert.doesNotThrow(() => assertNonEmptyString('a'.repeat(10_000), 'title'));
});

test('assertNonEmptyString throws TypeError when fieldName is null', () => {
  assert.throws(() => assertNonEmptyString('hello', null), TypeError);
});

test('assertNonEmptyString throws TypeError when fieldName is whitespace only', () => {
  assert.throws(() => assertNonEmptyString('hello', '   '), TypeError);
});

test('assertNonEmptyString capitalises only the first character of fieldName', () => {
  assert.throws(
    () => assertNonEmptyString('', 'myField'),
    { message: 'MyField is required.' }
  );
});

// assertEnum
test('assertEnum passes when value is in allowed list', () => {
  assert.doesNotThrow(() => assertEnum('done', 'status', ['todo', 'in-progress', 'done']));
});

test('assertEnum throws TypeError when value is not in allowed list', () => {
  assert.throws(
    () => assertEnum('closed', 'status', ['todo', 'in-progress', 'done']),
    { message: "Invalid status 'closed'. Expected: todo, in-progress, done." }
  );
});

test('assertEnum throws TypeError when allowed is not an array', () => {
  assert.throws(() => assertEnum('todo', 'status', 'todo'), TypeError);
});

test('assertEnum throws TypeError when fieldName is empty', () => {
  assert.throws(() => assertEnum('low', '', ['low', 'high']), TypeError);
});

test('assertEnum throws TypeError when value is undefined', () => {
  assert.throws(() => assertEnum(undefined, 'status', ['todo', 'done']), TypeError);
});

test('assertEnum throws TypeError when value is null', () => {
  assert.throws(() => assertEnum(null, 'priority', ['low', 'high']), TypeError);
});

test('assertEnum throws TypeError when value is a number', () => {
  assert.throws(() => assertEnum(1, 'status', ['todo', 'done']), TypeError);
});

test('assertEnum is case-sensitive', () => {
  assert.throws(
    () => assertEnum('Done', 'status', ['todo', 'in-progress', 'done']),
    { message: "Invalid status 'Done'. Expected: todo, in-progress, done." }
  );
});

test('assertEnum throws TypeError when allowed is an empty array', () => {
  assert.throws(() => assertEnum('todo', 'status', []), TypeError);
});

test('assertEnum passes for a single-element allowed array match', () => {
  assert.doesNotThrow(() => assertEnum('only', 'field', ['only']));
});

test('assertEnum throws TypeError for single-element allowed array mismatch', () => {
  assert.throws(() => assertEnum('other', 'field', ['only']), TypeError);
});

test('assertEnum throws TypeError when fieldName is null', () => {
  assert.throws(() => assertEnum('todo', null, ['todo']), TypeError);
});

test('assertEnum throws TypeError when fieldName is whitespace only', () => {
  assert.throws(() => assertEnum('todo', '   ', ['todo']), TypeError);
});

// assertPositiveInt
test('assertPositiveInt passes for a positive integer', () => {
  assert.doesNotThrow(() => assertPositiveInt(1, 'id'));
});

test('assertPositiveInt passes for a large positive integer', () => {
  assert.doesNotThrow(() => assertPositiveInt(9999, 'id'));
});

test('assertPositiveInt throws TypeError for zero', () => {
  assert.throws(() => assertPositiveInt(0, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for negative integer', () => {
  assert.throws(() => assertPositiveInt(-1, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for a float', () => {
  assert.throws(() => assertPositiveInt(1.5, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for a string', () => {
  assert.throws(() => assertPositiveInt('1', 'id'), TypeError);
});

test('assertPositiveInt throws TypeError when fieldName is empty', () => {
  assert.throws(() => assertPositiveInt(1, ''), TypeError);
});

test('assertPositiveInt throws TypeError for null', () => {
  assert.throws(() => assertPositiveInt(null, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for undefined', () => {
  assert.throws(() => assertPositiveInt(undefined, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for NaN', () => {
  assert.throws(() => assertPositiveInt(NaN, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for Infinity', () => {
  assert.throws(() => assertPositiveInt(Infinity, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for boolean true', () => {
  assert.throws(() => assertPositiveInt(true, 'id'), TypeError);
});

test('assertPositiveInt throws TypeError for an object', () => {
  assert.throws(() => assertPositiveInt({}, 'id'), TypeError);
});

test('assertPositiveInt passes for Number.MAX_SAFE_INTEGER', () => {
  assert.doesNotThrow(() => assertPositiveInt(Number.MAX_SAFE_INTEGER, 'id'));
});

test('assertPositiveInt throws TypeError when fieldName is null', () => {
  assert.throws(() => assertPositiveInt(1, null), TypeError);
});

test('assertPositiveInt throws TypeError when fieldName is whitespace only', () => {
  assert.throws(() => assertPositiveInt(1, '   '), TypeError);
});
