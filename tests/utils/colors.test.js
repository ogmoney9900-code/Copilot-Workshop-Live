import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorStatus, colorPriority } from '../../src/utils/colors.js';

// colorStatus — valid values
test('colorStatus returns a string for "done"', () => {
  assert.ok(typeof colorStatus('done') === 'string');
});

test('colorStatus returns a string for "in-progress"', () => {
  assert.ok(typeof colorStatus('in-progress') === 'string');
});

test('colorStatus returns a string for "todo"', () => {
  assert.ok(typeof colorStatus('todo') === 'string');
});

test('colorStatus output contains the status text for "done"', () => {
  assert.ok(colorStatus('done').includes('done'));
});

test('colorStatus output contains the status text for "in-progress"', () => {
  assert.ok(colorStatus('in-progress').includes('in-progress'));
});

test('colorStatus output contains the status text for "todo"', () => {
  assert.ok(colorStatus('todo').includes('todo'));
});

// colorStatus — normalization (whitespace trimming)
test('colorStatus accepts status with surrounding whitespace', () => {
  assert.ok(colorStatus('  done  ').includes('done'));
});

// colorStatus — invalid values
test('colorStatus throws TypeError for unknown status', () => {
  assert.throws(() => colorStatus('closed'), TypeError);
});

test('colorStatus TypeError message lists valid statuses', () => {
  assert.throws(
    () => colorStatus('closed'),
    { message: "Invalid status 'closed'. Expected: todo, in-progress, done." }
  );
});

test('colorStatus throws TypeError for empty string', () => {
  assert.throws(() => colorStatus(''), TypeError);
});

test('colorStatus throws TypeError for whitespace-only string', () => {
  assert.throws(() => colorStatus('   '), TypeError);
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

test('colorStatus is case-sensitive', () => {
  assert.throws(() => colorStatus('Done'), TypeError);
});

// colorPriority — valid values
test('colorPriority returns a string for "high"', () => {
  assert.ok(typeof colorPriority('high') === 'string');
});

test('colorPriority returns a string for "medium"', () => {
  assert.ok(typeof colorPriority('medium') === 'string');
});

test('colorPriority returns a string for "low"', () => {
  assert.ok(typeof colorPriority('low') === 'string');
});

test('colorPriority output contains the priority text for "high"', () => {
  assert.ok(colorPriority('high').includes('high'));
});

test('colorPriority output contains the priority text for "medium"', () => {
  assert.ok(colorPriority('medium').includes('medium'));
});

test('colorPriority output contains the priority text for "low"', () => {
  assert.ok(colorPriority('low').includes('low'));
});

// colorPriority — normalization (whitespace trimming)
test('colorPriority accepts priority with surrounding whitespace', () => {
  assert.ok(colorPriority('  high  ').includes('high'));
});

// colorPriority — invalid values
test('colorPriority throws TypeError for unknown priority', () => {
  assert.throws(() => colorPriority('critical'), TypeError);
});

test('colorPriority TypeError message lists valid priorities', () => {
  assert.throws(
    () => colorPriority('critical'),
    { message: "Invalid priority 'critical'. Expected: low, medium, high." }
  );
});

test('colorPriority throws TypeError for empty string', () => {
  assert.throws(() => colorPriority(''), TypeError);
});

test('colorPriority throws TypeError for whitespace-only string', () => {
  assert.throws(() => colorPriority('   '), TypeError);
});

test('colorPriority throws TypeError for null', () => {
  assert.throws(() => colorPriority(null), TypeError);
});

test('colorPriority throws TypeError for undefined', () => {
  assert.throws(() => colorPriority(undefined), TypeError);
});

test('colorPriority throws TypeError for a number', () => {
  assert.throws(() => colorPriority(99), TypeError);
});

test('colorPriority is case-sensitive', () => {
  assert.throws(() => colorPriority('High'), TypeError);
});
