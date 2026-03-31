import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Task } from '../../src/models/task.js';

test('creates a task with required title', () => {
  const task = new Task({ title: 'Buy milk' });
  assert.equal(task.title, 'Buy milk');
});

test('assigns a unique UUID id', () => {
  const a = new Task({ title: 'A' });
  const b = new Task({ title: 'B' });
  assert.match(a.id, /^[0-9a-f-]{36}$/);
  assert.notEqual(a.id, b.id);
});

test('default status is todo', () => {
  const task = new Task({ title: 'T' });
  assert.equal(task.status, 'todo');
});

test('default priority is medium', () => {
  const task = new Task({ title: 'T' });
  assert.equal(task.priority, 'medium');
});

test('default description is empty string', () => {
  const task = new Task({ title: 'T' });
  assert.equal(task.description, '');
});

test('trims leading and trailing whitespace from title', () => {
  const task = new Task({ title: '  Trim me  ' });
  assert.equal(task.title, 'Trim me');
});

test('assigns createdAt and updatedAt as ISO strings', () => {
  const task = new Task({ title: 'T' });
  assert.doesNotThrow(() => new Date(task.createdAt));
  assert.doesNotThrow(() => new Date(task.updatedAt));
});

test('accepts all valid status values', () => {
  for (const status of ['todo', 'in-progress', 'done']) {
    const task = new Task({ title: 'T', status });
    assert.equal(task.status, status);
  }
});

test('accepts all valid priority values', () => {
  for (const priority of ['low', 'medium', 'high']) {
    const task = new Task({ title: 'T', priority });
    assert.equal(task.priority, priority);
  }
});

test('throws TypeError when title is missing', () => {
  assert.throws(() => new Task({}), TypeError);
});

test('throws TypeError when title is an empty string', () => {
  assert.throws(() => new Task({ title: '' }), TypeError);
});

test('throws TypeError when title is whitespace only', () => {
  assert.throws(() => new Task({ title: '   ' }), TypeError);
});

test('throws TypeError when title exceeds 200 characters', () => {
  assert.throws(() => new Task({ title: 'x'.repeat(201) }), TypeError);
});

test('throws TypeError when description is not a string', () => {
  assert.throws(() => new Task({ title: 'T', description: 42 }), TypeError);
});

test('throws TypeError for invalid status', () => {
  assert.throws(
    () => new Task({ title: 'T', status: 'closed' }),
    { message: "Invalid status 'closed'. Expected: todo, in-progress, done." }
  );
});

test('throws TypeError for invalid priority', () => {
  assert.throws(
    () => new Task({ title: 'T', priority: 'urgent' }),
    { message: "Invalid priority 'urgent'. Expected: low, medium, high." }
  );
});

test('toJSON returns a plain object with all fields', () => {
  const task = new Task({ title: 'JSON task', description: 'desc', status: 'done', priority: 'high' });
  const json = task.toJSON();
  assert.equal(typeof json, 'object');
  assert.equal(json.title, 'JSON task');
  assert.equal(json.description, 'desc');
  assert.equal(json.status, 'done');
  assert.equal(json.priority, 'high');
  assert.ok(json.id);
  assert.ok(json.createdAt);
  assert.ok(json.updatedAt);
});

test('toJSON does not return a Task instance', () => {
  const task = new Task({ title: 'T' });
  assert.ok(!(task.toJSON() instanceof Task));
});

// --- Edge cases: boundary values ---

test('accepts title of exactly 1 character', () => {
  const task = new Task({ title: 'A' });
  assert.equal(task.title, 'A');
});

test('accepts title of exactly 200 characters', () => {
  const title = 'x'.repeat(200);
  const task = new Task({ title });
  assert.equal(task.title, title);
});

test('throws TypeError when title is exactly 201 characters after trim', () => {
  assert.throws(() => new Task({ title: 'x'.repeat(201) }), TypeError);
});

test('title with surrounding spaces counts trimmed length against 200-char limit', () => {
  // 200 x's with spaces around — trimmed length is exactly 200, should succeed
  const task = new Task({ title: '  ' + 'x'.repeat(200) + '  ' });
  assert.equal(task.title.length, 200);
});

test('accepts very long description', () => {
  const description = 'a'.repeat(10000);
  const task = new Task({ title: 'T', description });
  assert.equal(task.description, description);
});

// --- Edge cases: type mismatches ---

test('throws TypeError when title is null', () => {
  assert.throws(() => new Task({ title: null }), TypeError);
});

test('throws TypeError when title is a number', () => {
  assert.throws(() => new Task({ title: 123 }), TypeError);
});

test('throws TypeError when title is an array', () => {
  assert.throws(() => new Task({ title: ['task'] }), TypeError);
});

test('throws TypeError when title is a boolean', () => {
  assert.throws(() => new Task({ title: true }), TypeError);
});

test('throws TypeError when description is null', () => {
  assert.throws(() => new Task({ title: 'T', description: null }), TypeError);
});

test('throws TypeError when description is an array', () => {
  assert.throws(() => new Task({ title: 'T', description: ['desc'] }), TypeError);
});

test('throws TypeError when status is null', () => {
  assert.throws(() => new Task({ title: 'T', status: null }), TypeError);
});

test('throws TypeError when status is a number', () => {
  assert.throws(() => new Task({ title: 'T', status: 0 }), TypeError);
});

test('throws TypeError when priority is null', () => {
  assert.throws(() => new Task({ title: 'T', priority: null }), TypeError);
});

test('throws TypeError when priority is false', () => {
  assert.throws(() => new Task({ title: 'T', priority: false }), TypeError);
});

// --- Edge cases: missing optional fields ---

test('throws TypeError when no argument is passed to constructor', () => {
  assert.throws(() => new Task(), TypeError);
});

test('accepts task with only title and no other fields', () => {
  const task = new Task({ title: 'Minimal' });
  assert.equal(task.title, 'Minimal');
  assert.equal(task.description, '');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
});

// --- Edge cases: toJSON integrity ---

test('toJSON returns a shallow copy — mutating it does not affect the task', () => {
  const task = new Task({ title: 'Original' });
  const json = task.toJSON();
  json.title = 'Mutated';
  assert.equal(task.title, 'Original');
});

test('toJSON includes empty description when none was provided', () => {
  const task = new Task({ title: 'T' });
  const json = task.toJSON();
  assert.equal(json.description, '');
});

// --- Edge cases: Unicode / special characters ---

test('accepts title with Unicode characters', () => {
  const task = new Task({ title: '买牛奶 🥛' });
  assert.equal(task.title, '买牛奶 🥛');
});

test('accepts description with newlines and special characters', () => {
  const description = 'Line 1\nLine 2\t<script>alert(1)</script>';
  const task = new Task({ title: 'T', description });
  assert.equal(task.description, description);
});
