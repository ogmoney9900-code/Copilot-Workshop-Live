import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorStatus, colorPriority } from '../../src/utils/colors.js';

// colorStatus - input validation
test('colorStatus throws TypeError for non-string input', () => {
  assert.throws(() => colorStatus(42), TypeError);
});

test('colorStatus throws TypeError for null input', () => {
  assert.throws(() => colorStatus(null), TypeError);
});

test('colorStatus throws TypeError for undefined input', () => {
  assert.throws(() => colorStatus(undefined), TypeError);
});

test('colorStatus throws TypeError for blank string', () => {
  assert.throws(() => colorStatus('   '), TypeError);
});

test('colorStatus throws TypeError for empty string', () => {
  assert.throws(() => colorStatus(''), TypeError);
});

// colorStatus - unsupported values
test('colorStatus throws TypeError for unsupported status value', () => {
  assert.throws(() => colorStatus('closed'), TypeError);
});

test('colorStatus throws TypeError for unsupported status value with message', () => {
  assert.throws(
    () => colorStatus('archived'),
    { message: "Unsupported status value: 'archived'." }
  );
});

// colorStatus - supported values return ANSI-wrapped strings
test('colorStatus returns string containing the status text for done', () => {
  const result = colorStatus('done');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('done'));
});

test('colorStatus returns string containing the status text for in-progress', () => {
  const result = colorStatus('in-progress');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('in-progress'));
});

test('colorStatus returns string containing the status text for todo', () => {
  const result = colorStatus('todo');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('todo'));
});

test('colorStatus wraps done in green ANSI code', () => {
  const result = colorStatus('done');
  assert.ok(result.includes('\x1b[32m'), 'should contain green ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});

test('colorStatus wraps in-progress in yellow ANSI code', () => {
  const result = colorStatus('in-progress');
  assert.ok(result.includes('\x1b[33m'), 'should contain yellow ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});

test('colorStatus wraps todo in red ANSI code', () => {
  const result = colorStatus('todo');
  assert.ok(result.includes('\x1b[31m'), 'should contain red ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});

// colorPriority - input validation
test('colorPriority throws TypeError for non-string input', () => {
  assert.throws(() => colorPriority(99), TypeError);
});

test('colorPriority throws TypeError for null input', () => {
  assert.throws(() => colorPriority(null), TypeError);
});

test('colorPriority throws TypeError for undefined input', () => {
  assert.throws(() => colorPriority(undefined), TypeError);
});

test('colorPriority throws TypeError for blank string', () => {
  assert.throws(() => colorPriority('   '), TypeError);
});

test('colorPriority throws TypeError for empty string', () => {
  assert.throws(() => colorPriority(''), TypeError);
});

// colorPriority - unsupported values
test('colorPriority throws TypeError for unsupported priority value', () => {
  assert.throws(() => colorPriority('critical'), TypeError);
});

test('colorPriority throws TypeError for unsupported priority value with message', () => {
  assert.throws(
    () => colorPriority('urgent'),
    { message: "Unsupported priority value: 'urgent'." }
  );
});

// colorPriority - supported values return ANSI-wrapped strings
test('colorPriority returns string containing the priority text for high', () => {
  const result = colorPriority('high');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('high'));
});

test('colorPriority returns string containing the priority text for medium', () => {
  const result = colorPriority('medium');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('medium'));
});

test('colorPriority returns string containing the priority text for low', () => {
  const result = colorPriority('low');
  assert.ok(typeof result === 'string');
  assert.ok(result.includes('low'));
});

test('colorPriority wraps high in bold and red ANSI codes', () => {
  const result = colorPriority('high');
  assert.ok(result.includes('\x1b[1m'), 'should contain bold ANSI code');
  assert.ok(result.includes('\x1b[31m'), 'should contain red ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});

test('colorPriority wraps medium in bold and yellow ANSI codes', () => {
  const result = colorPriority('medium');
  assert.ok(result.includes('\x1b[1m'), 'should contain bold ANSI code');
  assert.ok(result.includes('\x1b[33m'), 'should contain yellow ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});

test('colorPriority wraps low in dim ANSI code', () => {
  const result = colorPriority('low');
  assert.ok(result.includes('\x1b[2m'), 'should contain dim ANSI code');
  assert.ok(result.includes('\x1b[0m'), 'should contain reset ANSI code');
});
