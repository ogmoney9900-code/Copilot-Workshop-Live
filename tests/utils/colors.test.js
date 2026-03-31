import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorStatus, colorPriority } from '../../src/utils/colors.js';

// colorStatus — valid values
test('colorStatus returns a string for done', () => {
  assert.equal(typeof colorStatus('done'), 'string');
});

test('colorStatus returns a string for in-progress', () => {
  assert.equal(typeof colorStatus('in-progress'), 'string');
});

test('colorStatus returns a string for todo', () => {
  assert.equal(typeof colorStatus('todo'), 'string');
});

test('colorStatus output contains the original status word for done', () => {
  assert.ok(colorStatus('done').includes('done'));
});

test('colorStatus output contains the original status word for in-progress', () => {
  assert.ok(colorStatus('in-progress').includes('in-progress'));
});

test('colorStatus output contains the original status word for todo', () => {
  assert.ok(colorStatus('todo').includes('todo'));
});

// colorStatus — invalid values
test('colorStatus throws TypeError for an unknown status string', () => {
  assert.throws(() => colorStatus('closed'), TypeError);
});

test('colorStatus throws TypeError for an empty string', () => {
  assert.throws(() => colorStatus(''), TypeError);
});

test('colorStatus throws TypeError for null', () => {
  assert.throws(() => colorStatus(null), TypeError);
});

test('colorStatus throws TypeError for undefined', () => {
  assert.throws(() => colorStatus(undefined), TypeError);
});

test('colorStatus throws TypeError for a number', () => {
  assert.throws(() => colorStatus(42), TypeError);
});

test('colorStatus error message includes the invalid value', () => {
  assert.throws(
    () => colorStatus('invalid'),
    { message: "Invalid status 'invalid'. Expected: todo, in-progress, done." }
  );
});

// colorPriority — valid values
test('colorPriority returns a string for high', () => {
  assert.equal(typeof colorPriority('high'), 'string');
});

test('colorPriority returns a string for medium', () => {
  assert.equal(typeof colorPriority('medium'), 'string');
});

test('colorPriority returns a string for low', () => {
  assert.equal(typeof colorPriority('low'), 'string');
});

test('colorPriority output contains the original priority word for high', () => {
  assert.ok(colorPriority('high').includes('high'));
});

test('colorPriority output contains the original priority word for medium', () => {
  assert.ok(colorPriority('medium').includes('medium'));
});

test('colorPriority output contains the original priority word for low', () => {
  assert.ok(colorPriority('low').includes('low'));
});

// colorPriority — invalid values
test('colorPriority throws TypeError for an unknown priority string', () => {
  assert.throws(() => colorPriority('critical'), TypeError);
});

test('colorPriority throws TypeError for an empty string', () => {
  assert.throws(() => colorPriority(''), TypeError);
});

test('colorPriority throws TypeError for null', () => {
  assert.throws(() => colorPriority(null), TypeError);
});

test('colorPriority throws TypeError for undefined', () => {
  assert.throws(() => colorPriority(undefined), TypeError);
});

test('colorPriority throws TypeError for a number', () => {
  assert.throws(() => colorPriority(0), TypeError);
});

test('colorPriority error message includes the invalid value', () => {
  assert.throws(
    () => colorPriority('urgent'),
    { message: "Invalid priority 'urgent'. Expected: low, medium, high." }
  );
});
