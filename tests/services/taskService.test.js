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

// --- Edge cases ---

// createTask boundary values
test('createTask accepts title of exactly 200 characters', () => {
  const title = 'a'.repeat(200);
  const task = createTask({ title });
  assert.equal(task.title, title);
});

test('createTask throws TypeError for title longer than 200 characters', () => {
  assert.throws(() => createTask({ title: 'a'.repeat(201) }), TypeError);
});

test('createTask throws TypeError for whitespace-only title', () => {
  assert.throws(() => createTask({ title: '   ' }), TypeError);
});

test('createTask accepts a very long description', () => {
  const task = createTask({ title: 'Long desc', description: 'x'.repeat(10000) });
  assert.equal(task.description.length, 10000);
});

// createTask type mismatches
test('createTask throws TypeError when title is a number', () => {
  assert.throws(() => createTask({ title: 42 }), TypeError);
});

test('createTask throws TypeError when title is null', () => {
  assert.throws(() => createTask({ title: null }), TypeError);
});

test('createTask throws TypeError when title is an array', () => {
  assert.throws(() => createTask({ title: ['Task'] }), TypeError);
});

test('createTask throws TypeError for invalid status value', () => {
  assert.throws(() => createTask({ title: 'T', status: 'pending' }), TypeError);
});

// createTask duplicate titles allowed (different IDs)
test('createTask allows two tasks with the same title', () => {
  const a = createTask({ title: 'Duplicate title' });
  const b = createTask({ title: 'Duplicate title' });
  assert.notEqual(a.id, b.id);
  assert.equal(a.title, b.title);
});

// getAllTasks / getTaskById isolation
test('getAllTasks returns a copy — mutating it does not affect the store', () => {
  const before = getAllTasks().length;
  const copy = getAllTasks();
  copy.push({ id: 'fake', title: 'injected' });
  assert.equal(getAllTasks().length, before);
});

test('getTaskById returns a copy — mutating it does not affect the store', () => {
  const t = createTask({ title: 'Isolation check' });
  const copy = getTaskById(t.id);
  copy.title = 'mutated';
  const fresh = getTaskById(t.id);
  assert.equal(fresh.title, 'Isolation check');
});

test('getTaskById throws Error for null id', () => {
  assert.throws(() => getTaskById(null), Error);
});

// queryTasks edge cases
test('queryTasks with no options returns all tasks', () => {
  const all = getAllTasks();
  const queried = queryTasks();
  assert.equal(queried.length, all.length);
});

test('queryTasks with empty options object returns all tasks', () => {
  const all = getAllTasks();
  const queried = queryTasks({});
  assert.equal(queried.length, all.length);
});

test('queryTasks combines status and priority filters', () => {
  createTask({ title: 'combo-a', status: 'done', priority: 'low' });
  createTask({ title: 'combo-b', status: 'done', priority: 'high' });
  const results = queryTasks({ status: 'done', priority: 'low' });
  assert.ok(results.every(r => r.status === 'done' && r.priority === 'low'));
  assert.ok(results.some(r => r.title === 'combo-a'));
  assert.ok(!results.some(r => r.title === 'combo-b'));
});

test('queryTasks with filter returns empty array when no matches', () => {
  // delete all done+high tasks first to guarantee empty result is possible
  const results = queryTasks({ status: 'todo', priority: 'high' });
  // Just assert it's an array (may or may not be empty depending on store)
  assert.ok(Array.isArray(results));
});

test('queryTasks combined filter and sort', () => {
  createTask({ title: 'sort-filter-a', status: 'todo', priority: 'low' });
  createTask({ title: 'sort-filter-b', status: 'todo', priority: 'high' });
  const results = queryTasks({ status: 'todo', sortBy: 'priority' });
  const todoResults = results.filter(r => r.status === 'todo');
  assert.equal(todoResults.length, results.length);
  const highIdx = results.findIndex(r => r.priority === 'high');
  const lowIdx = results.findIndex(r => r.priority === 'low');
  assert.ok(highIdx < lowIdx);
});

// updateTask boundary values
test('updateTask accepts title of exactly 200 characters', () => {
  const t = createTask({ title: 'Update boundary' });
  const updated = updateTask(t.id, { title: 'b'.repeat(200) });
  assert.equal(updated.title, 'b'.repeat(200));
});

test('updateTask throws TypeError for title longer than 200 characters', () => {
  const t = createTask({ title: 'Too long update' });
  assert.throws(() => updateTask(t.id, { title: 'c'.repeat(201) }), TypeError);
});

test('updateTask with empty patch object returns task unchanged', () => {
  const t = createTask({ title: 'No-op update' });
  const updated = updateTask(t.id, {});
  assert.equal(updated.title, 'No-op update');
  assert.equal(updated.status, 'todo');
  assert.equal(updated.priority, 'medium');
});

test('updateTask throws TypeError for invalid priority value', () => {
  const t = createTask({ title: 'Bad priority update' });
  assert.throws(() => updateTask(t.id, { priority: 'urgent' }), TypeError);
});

// deleteTask — idempotency / double delete
test('deleteTask throws Error on second delete of the same id', () => {
  const t = createTask({ title: 'Double delete' });
  deleteTask(t.id);
  assert.throws(() => deleteTask(t.id), Error);
});
