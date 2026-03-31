import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  getAllTasks,
  getTaskById,
  queryTasks,
  updateTask,
  deleteTask,
} from '../../src/services/taskService.js';

// createTask
test('createTask returns a plain object with correct fields', () => {
  const task = createTask({ title: 'Service test task' });
  assert.equal(task.title, 'Service test task');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
  assert.ok(task.id);
});

test('createTask throws TypeError for missing title', () => {
  assert.throws(() => createTask({}), TypeError);
});

test('createTask throws TypeError for invalid priority', () => {
  assert.throws(() => createTask({ title: 'T', priority: 'critical' }), TypeError);
});

// getAllTasks
test('getAllTasks returns an array', () => {
  const result = getAllTasks();
  assert.ok(Array.isArray(result));
});

test('getAllTasks includes tasks created earlier in this module', () => {
  const created = createTask({ title: 'getAllTasks target' });
  const all = getAllTasks();
  assert.ok(all.some(t => t.id === created.id));
});

// getTaskById
test('getTaskById returns the correct task', () => {
  const created = createTask({ title: 'getById target' });
  const found = getTaskById(created.id);
  assert.equal(found.id, created.id);
  assert.equal(found.title, 'getById target');
});

test('getTaskById throws Error for unknown id', () => {
  assert.throws(
    () => getTaskById('00000000-0000-0000-0000-000000000000'),
    { message: 'Task with ID 00000000-0000-0000-0000-000000000000 not found.' }
  );
});

// queryTasks - filtering
test('queryTasks filters by status', () => {
  const t = createTask({ title: 'Q-status', status: 'in-progress' });
  const results = queryTasks({ status: 'in-progress' });
  assert.ok(results.some(r => r.id === t.id));
  assert.ok(results.every(r => r.status === 'in-progress'));
});

test('queryTasks filters by priority', () => {
  const t = createTask({ title: 'Q-priority', priority: 'high' });
  const results = queryTasks({ priority: 'high' });
  assert.ok(results.some(r => r.id === t.id));
  assert.ok(results.every(r => r.priority === 'high'));
});

test('queryTasks throws TypeError for invalid status filter', () => {
  assert.throws(() => queryTasks({ status: 'invalid' }), TypeError);
});

test('queryTasks throws TypeError for invalid priority filter', () => {
  assert.throws(() => queryTasks({ priority: 'invalid' }), TypeError);
});

// queryTasks - sorting
test('queryTasks sorts by priority ascending (high first)', () => {
  createTask({ title: 'Low prio', priority: 'low' });
  createTask({ title: 'High prio', priority: 'high' });
  const results = queryTasks({ sortBy: 'priority' });
  const priorities = results.map(r => r.priority);
  const highIndex = priorities.indexOf('high');
  const lowIndex = priorities.lastIndexOf('low');
  assert.ok(highIndex < lowIndex);
});

test('queryTasks sorts by createdAt ascending by default', () => {
  const results = queryTasks({ sortBy: 'createdAt' });
  for (let i = 1; i < results.length; i++) {
    assert.ok(new Date(results[i].createdAt) >= new Date(results[i - 1].createdAt));
  }
});

test('queryTasks with desc=true reverses sort order', () => {
  const asc = queryTasks({ sortBy: 'createdAt' });
  const desc = queryTasks({ sortBy: 'createdAt', desc: true });
  assert.deepEqual(asc.map(t => t.id), desc.map(t => t.id).reverse());
});

// updateTask
test('updateTask updates the title', () => {
  const t = createTask({ title: 'Old title' });
  const updated = updateTask(t.id, { title: 'New title' });
  assert.equal(updated.title, 'New title');
});

test('updateTask updates the status', () => {
  const t = createTask({ title: 'Status update' });
  const updated = updateTask(t.id, { status: 'done' });
  assert.equal(updated.status, 'done');
});

test('updateTask updates the priority', () => {
  const t = createTask({ title: 'Priority update' });
  const updated = updateTask(t.id, { priority: 'low' });
  assert.equal(updated.priority, 'low');
});

test('updateTask updates the description', () => {
  const t = createTask({ title: 'Desc update' });
  const updated = updateTask(t.id, { description: 'new desc' });
  assert.equal(updated.description, 'new desc');
});

test('updateTask refreshes updatedAt', () => {
  const t = createTask({ title: 'Timestamp update' });
  const before = t.updatedAt;
  const updated = updateTask(t.id, { title: 'Changed' });
  assert.ok(updated.updatedAt >= before);
});

test('updateTask throws Error for unknown id', () => {
  assert.throws(
    () => updateTask('00000000-0000-0000-0000-000000000000', { title: 'X' }),
    { message: 'Task with ID 00000000-0000-0000-0000-000000000000 not found.' }
  );
});

test('updateTask throws TypeError for invalid status', () => {
  const t = createTask({ title: 'Invalid status update' });
  assert.throws(() => updateTask(t.id, { status: 'closed' }), TypeError);
});

test('updateTask throws TypeError for blank title', () => {
  const t = createTask({ title: 'Blank title update' });
  assert.throws(() => updateTask(t.id, { title: '' }), TypeError);
});

test('updateTask throws TypeError for non-string description', () => {
  const t = createTask({ title: 'Bad desc type' });
  assert.throws(() => updateTask(t.id, { description: 123 }), TypeError);
});

// deleteTask
test('deleteTask returns the deleted task', () => {
  const t = createTask({ title: 'To delete' });
  const deleted = deleteTask(t.id);
  assert.equal(deleted.id, t.id);
  assert.equal(deleted.title, 'To delete');
});

test('deleteTask removes the task from the store', () => {
  const t = createTask({ title: 'Remove me' });
  deleteTask(t.id);
  assert.throws(() => getTaskById(t.id), Error);
});

test('deleteTask throws Error for unknown id', () => {
  assert.throws(
    () => deleteTask('00000000-0000-0000-0000-000000000000'),
    { message: 'Task with ID 00000000-0000-0000-0000-000000000000 not found.' }
  );
});
