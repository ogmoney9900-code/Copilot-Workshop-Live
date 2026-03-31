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
