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
