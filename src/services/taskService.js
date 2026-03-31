import { Task } from '../models/task.js';
import { assertEnum, assertNonEmptyString } from '../utils/validators.js';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/** @type {Task[]} */
const store = [];

/**
 * Creates a new task and adds it to the store.
 * @param {{ title: string, description?: string, status?: string, priority?: string }} fields
 * @returns {object} The newly created task as a plain object.
 * @throws {TypeError} If any field is invalid.
 */
export function createTask(fields) {
  const task = new Task(fields);
  store.push(task);
  return task.toJSON();
}

/**
 * Returns a copy of all tasks in the store.
 * @returns {object[]}
 */
export function getAllTasks() {
  return store.map(t => t.toJSON());
}

/**
 * Returns the task with the given ID.
 * @param {string} id - Task UUID.
 * @returns {object} The matching task as a plain object.
 * @throws {Error} If no task with the given ID exists.
 */
export function getTaskById(id) {
  const task = store.find(t => t.id === id);
  if (!task) {
    throw new Error(`Task with ID ${id} not found.`);
  }
  return task.toJSON();
}

/**
 * Queries tasks with optional filters and sorting.
 * @param {{ status?: string, priority?: string, sortBy?: 'priority'|'createdAt', desc?: boolean }} options
 * @returns {object[]} Filtered and sorted task plain objects.
 * @throws {TypeError} If an invalid status or priority filter value is provided.
 */
export function queryTasks({ status, priority, sortBy, desc = false } = {}) {
  let results = store.map(t => t.toJSON());

  if (status !== undefined) {
    assertEnum(status, 'status', VALID_STATUSES);
    results = results.filter(t => t.status === status);
  }

  if (priority !== undefined) {
    assertEnum(priority, 'priority', VALID_PRIORITIES);
    results = results.filter(t => t.priority === priority);
  }

  if (sortBy === 'priority') {
    results.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (desc) results.reverse();
  } else if (sortBy === 'createdAt') {
    results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (desc) results.reverse();
  }

  return results;
}

/**
 * Updates fields on an existing task.
 * @param {string} id - Task UUID.
 * @param {{ title?: string, description?: string, status?: string, priority?: string }} fields
 * @returns {object} The updated task as a plain object.
 * @throws {Error} If no task with the given ID exists.
 * @throws {TypeError} If any provided field value is invalid.
 */
export function updateTask(id, fields) {
  const task = store.find(t => t.id === id);
  if (!task) {
    throw new Error(`Task with ID ${id} not found.`);
  }

  if (fields.title !== undefined) {
    assertNonEmptyString(fields.title, 'title');
    if (fields.title.trim().length > 200) {
      throw new TypeError('Title must not exceed 200 characters.');
    }
    task.title = fields.title.trim();
  }

  if (fields.description !== undefined) {
    if (typeof fields.description !== 'string') {
      throw new TypeError('description must be a string.');
    }
    task.description = fields.description;
  }

  if (fields.status !== undefined) {
    assertEnum(fields.status, 'status', VALID_STATUSES);
    task.status = fields.status;
  }

  if (fields.priority !== undefined) {
    assertEnum(fields.priority, 'priority', VALID_PRIORITIES);
    task.priority = fields.priority;
  }

  task.updatedAt = new Date().toISOString();
  return task.toJSON();
}

/**
 * Deletes a task by ID.
 * @param {string} id - Task UUID.
 * @returns {object} The deleted task as a plain object.
 * @throws {Error} If no task with the given ID exists.
 */
export function deleteTask(id) {
  const index = store.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error(`Task with ID ${id} not found.`);
  }
  const [task] = store.splice(index, 1);
  return task.toJSON();
}
