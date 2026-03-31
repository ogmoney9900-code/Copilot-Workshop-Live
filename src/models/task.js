import { randomUUID } from 'node:crypto';

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Represents a task in the Task Manager.
 */
export class Task {
  /**
   * Creates a new Task instance.
   * @param {object} fields - Task fields.
   * @param {string} fields.title - Required. Non-empty string, max 200 chars.
   * @param {string} [fields.description=''] - Optional description string.
   * @param {'todo'|'in-progress'|'done'} [fields.status='todo'] - Task status.
   * @param {'low'|'medium'|'high'} [fields.priority='medium'] - Task priority.
   * @throws {TypeError} If any field fails validation.
   */
  constructor({ title, description = '', status = 'todo', priority = 'medium' } = {}) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new TypeError('Title is required.');
    }
    if (title.trim().length > 200) {
      throw new TypeError('Title must not exceed 200 characters.');
    }
    if (typeof description !== 'string') {
      throw new TypeError('description must be a string.');
    }
    if (!VALID_STATUSES.includes(status)) {
      throw new TypeError(`Invalid status '${status}'. Expected: todo, in-progress, done.`);
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new TypeError(`Invalid priority '${priority}'. Expected: low, medium, high.`);
    }

    this.id = randomUUID();
    this.title = title.trim();
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Returns a plain object representation of this task.
   * @returns {{ id: string, title: string, description: string, status: string, priority: string, createdAt: string, updatedAt: string }}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
