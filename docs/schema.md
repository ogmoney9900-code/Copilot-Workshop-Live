# Technical Design: Task Manager CLI

## 1. Data Models

### Task

| Property      | Type     | Required | Validation rules                                        |
|---------------|----------|----------|---------------------------------------------------------|
| `id`          | `number` | yes      | Auto-assigned integer starting at 1. Must be a positive integer. Read-only — rejected if supplied by the caller on create or update. |
| `title`       | `string` | yes      | Must be a non-empty string after trimming whitespace. Max 200 characters. Throws if missing or blank. |
| `description` | `string` | no       | Must be a string if provided. Defaults to `""` on create. No maximum length enforced. |
| `status`      | `string` | no       | Must be exactly one of `"todo"` \| `"in-progress"` \| `"done"`. Defaults to `"todo"` on create. Throws on unrecognised value. Case-sensitive. |
| `priority`    | `string` | no       | Must be exactly one of `"low"` \| `"medium"` \| `"high"`. Defaults to `"medium"` on create. Throws on unrecognised value. Case-sensitive. |
| `createdAt`   | `string` | yes      | ISO 8601 UTC timestamp (`Date.toISOString()`). Set by the system on creation. Read-only — silently ignored if supplied by the caller. |
| `updatedAt`   | `string` | yes      | ISO 8601 UTC timestamp. Set by the system on creation and refreshed on every successful update. Read-only — silently ignored if supplied by the caller. |

### Validation rules (detail)

**`id`**
- Assigned by `getNextId()` in `store.js`; never accepted from user input.
- `assertPositiveInt` is used when resolving a task by ID in CLI commands (ensures the parsed CLI argument is a positive integer before calling `getTaskById`).

**`title`**
- Validated with `assertNonEmptyString('title')`.
- Trim is applied before the empty check; a string of only spaces is treated as empty.
- Max 200 characters checked after trim; throws `"Title must not exceed 200 characters."`.
- Required on `createTask`; required if provided on `updateTask` (cannot be explicitly set to blank).

**`description`**
- No `assertNonEmptyString` — empty string is valid.
- Must be a `string` (typeof check); throws `"description must be a string."` if a non-string is passed.
- Omitting the field on `createTask` sets it to `""`. Omitting it on `updateTask` leaves the existing value unchanged.

**`status`**
- Validated with `assertEnum('status', ['todo', 'in-progress', 'done'])`.
- Omitting on `createTask` defaults to `"todo"`. Omitting on `updateTask` leaves the existing value unchanged.
- Throws `"Invalid status '<value>'. Expected: todo, in-progress, done."` on any other value.

**`priority`**
- Validated with `assertEnum('priority', ['low', 'medium', 'high'])`.
- Omitting on `createTask` defaults to `"medium"`. Omitting on `updateTask` leaves the existing value unchanged.
- Throws `"Invalid priority '<value>'. Expected: low, medium, high."` on any other value.

**`createdAt` / `updatedAt`**
- Both set to `new Date().toISOString()` at creation time.
- `updatedAt` is refreshed inside `updateTask` after all field validation passes.
- Neither field is accepted from the caller — any supplied value is discarded before the task object is written.

**Example object:**

```js
{
  id: 1,
  title: 'Write project plan',
  description: 'Draft the plan for the workshop exercise',
  status: 'todo',
  priority: 'high',
  createdAt: '2026-03-31T09:00:00.000Z',
  updatedAt: '2026-03-31T09:00:00.000Z'
}
```

### In-memory store

A module-level `Array` of Task objects held in `src/store.js`. A separate `nextId` counter is
incremented each time a task is created. No persistence — all data is lost when the process exits.

---

## 2. File Structure

```
index.js              # Entry point — imports and calls cli.js
src/
  store.js            # In-memory task array and nextId counter
  tasks.js            # CRUD + query: createTask, getAllTasks, getTaskById,
                      #   queryTasks, updateTask, deleteTask
  filters.js          # Pure filter helpers: filterByStatus, filterByPriority
  sort.js             # Pure sort helpers: sortByPriority, sortByCreatedAt
  display.js          # Format and print task lists to stdout (ANSI colour)
  validate.js         # Shared validation: assertNonEmptyString, assertEnum,
                      #   assertPositiveInt
  cli.js              # Parse process.argv, validate flags, dispatch to tasks.js
tests/
  tasks.test.js       # Unit tests using node:test and node:assert
```

---

## 3. Module Responsibilities

### `src/store.js`
- Exports: `tasks` (the mutable array), `nextId` counter, `getNextId()` helper that increments and returns the counter.
- Depends on: nothing.

### `src/validate.js`
- Exports:
  - `assertNonEmptyString(value, fieldName)` — throws if value is not a non-empty string after trim.
  - `assertEnum(value, fieldName, allowed)` — throws if value is not in the `allowed` array.
  - `assertPositiveInt(value, fieldName)` — throws if value is not a positive integer.
- Depends on: nothing.

### `src/filters.js`
- Exports:
  - `filterByStatus(tasks, status)` — returns tasks matching the given status.
  - `filterByPriority(tasks, priority)` — returns tasks matching the given priority.
- Depends on: nothing (pure functions over arrays).

### `src/sort.js`
- Exports:
  - `sortByPriority(tasks, desc)` — sorts high → medium → low (reversed when `desc` is `true`).
  - `sortByCreatedAt(tasks, desc)` — sorts oldest → newest (reversed when `desc` is `true`).
- Depends on: nothing (pure functions over arrays).

### `src/tasks.js`
- Exports:
  - `createTask({ title, description, status, priority })` — validates input, writes to store, returns new task.
  - `getAllTasks()` — returns a copy of the store array.
  - `getTaskById(id)` — returns the matching task or throws a not-found error.
  - `queryTasks({ status, priority, sortBy, desc })` — composes filters and sort, returns results.
  - `updateTask(id, fields)` — validates fields, patches the task, refreshes `updatedAt`, returns updated task.
  - `deleteTask(id)` — removes task from store, returns deleted task.
- Depends on: `store.js`, `validate.js`, `filters.js`, `sort.js`.

### `src/display.js`
- Exports:
  - `printTasks(tasks)` — formats tasks as an aligned table with ANSI colour on priority; prints to stdout. Shows a friendly message when the array is empty.
  - `printTask(task)` — formats and prints a single task.
- Depends on: nothing.

### `src/cli.js`
- Exports: `run()` — parses `process.argv`, validates flags, dispatches to `tasks.js`, calls `display.js`, exits with code `1` on error.
- Depends on: `tasks.js`, `display.js`, `validate.js`.

### `index.js`
- Imports `run` from `src/cli.js` and calls it.
- Depends on: `src/cli.js`.

---

## 4. Error Handling Strategy

Library modules (`tasks.js`, `filters.js`, `sort.js`, `validate.js`) always **throw**; they never
call `process.exit` or write to stderr. The CLI boundary (`cli.js`) is the only place that catches
errors, writes to stderr, and exits.

### Error types and throw sites

| Error message pattern | Thrown in |
|---|---|
| `"Title is required."` | `validate.js` → `assertNonEmptyString` |
| `"Invalid status '<value>'. Expected: todo, in-progress, done."` | `validate.js` → `assertEnum` |
| `"Invalid priority '<value>'. Expected: low, medium, high."` | `validate.js` → `assertEnum` |
| `"<fieldName> must be a positive integer."` | `validate.js` → `assertPositiveInt` |
| `"Task with ID <n> not found."` | `tasks.js` → `getTaskById`, `updateTask`, `deleteTask` |
| `"Unknown command '<cmd>'. Run with --help for usage."` | `cli.js` |

### CLI boundary pattern

```js
// src/cli.js
try {
  // dispatch command
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
```

All thrown values are `Error` instances with a descriptive `message`. Plain strings are never
thrown.
