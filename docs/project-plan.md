# Project Plan: Task Manager CLI

## 1. Project Overview

Task Manager CLI is a lightweight command-line application built with Node.js 20+ that allows
users to create, read, update, and delete tasks entirely in memory. Each task carries a title,
description, priority, and status, and the application provides filtering and sorting capabilities
so users can quickly locate the work that matters most. The project uses only Node.js built-in
modules — no external dependencies — making it an ideal workshop exercise for exploring Copilot
configuration across the full software development lifecycle.

---

## 2. User Stories

1. **Create a task**
   As a user, I want to add a new task with a title, description, priority, and status so that I
   can start tracking work.
   - Acceptance criteria:
     - Task is assigned a unique numeric ID automatically.
     - `createdAt` and `updatedAt` are set to the current ISO timestamp on creation.
     - Default status is `todo`; default priority is `medium`.
     - Title is required; description is optional.

2. **List all tasks**
   As a user, I want to see all tasks so that I have an overview of my workload.
   - Acceptance criteria:
     - Output displays ID, title, priority, status, and `createdAt` for every task.
     - When no tasks exist, a friendly message is shown.

3. **Filter tasks**
   As a user, I want to filter tasks by status or priority so that I can focus on a subset of work.
   - Acceptance criteria:
     - Filtering by `status` returns only tasks matching `todo`, `in-progress`, or `done`.
     - Filtering by `priority` returns only tasks matching `low`, `medium`, or `high`.
     - Both filters can be combined in the same call.

4. **Sort tasks**
   As a user, I want to sort tasks by priority or creation date so that I can triage my work.
   - Acceptance criteria:
     - Sorting by `priority` orders tasks high → medium → low.
     - Sorting by `createdAt` orders tasks oldest → newest (ascending).
     - Sort direction can be reversed with a `--desc` flag.

5. **Update a task**
   As a user, I want to update a task's title, description, status, or priority so that I can
   reflect changes in my work.
   - Acceptance criteria:
     - Only fields provided in the command are changed; others remain unchanged.
     - `updatedAt` is refreshed to the current ISO timestamp.
     - Updating a non-existent ID shows a clear error.

6. **Delete a task**
   As a user, I want to delete a task by ID so that I can remove completed or cancelled work.
   - Acceptance criteria:
     - The task is removed from the in-memory store.
     - Deleting a non-existent ID shows a clear error.
     - A confirmation message is printed on success.

---

## 3. Data Model

### Task

| Property      | Type     | Values / Format                         |
|---------------|----------|-----------------------------------------|
| `id`          | `number` | Auto-incrementing integer, starting at 1 |
| `title`       | `string` | Required, non-empty                      |
| `description` | `string` | Optional, defaults to `""`              |
| `status`      | `string` | `"todo"` \| `"in-progress"` \| `"done"` |
| `priority`    | `string` | `"low"` \| `"medium"` \| `"high"`       |
| `createdAt`   | `string` | ISO 8601 timestamp                      |
| `updatedAt`   | `string` | ISO 8601 timestamp                      |

### In-memory store

A single module-level array of Task objects serves as the store. No persistence layer is needed.

```js
// Example task object
{
  id: 1,
  title: "Write project plan",
  description: "Draft the plan for the workshop exercise",
  status: "done",
  priority: "high",
  createdAt: "2026-03-31T09:00:00.000Z",
  updatedAt: "2026-03-31T10:30:00.000Z"
}
```

---

## 4. File Structure

```
src/
  store.js          # In-memory task array and next-ID counter
  tasks.js          # CRUD functions: createTask, getTasks, updateTask, deleteTask
  filters.js        # filterByStatus, filterByPriority
  sort.js           # sortByPriority, sortByCreatedAt
  display.js        # Format and print task lists to stdout
  validate.js       # Shared validation helpers: assertNonEmptyString, assertEnum, assertPositiveInt
  cli.js            # Parse process.argv and dispatch commands
index.js            # Entry point — calls cli.js
```

---

## 5. Implementation Phases

### Phase 1 — Core data layer
- Implement `store.js` with the in-memory array and ID generator.
- Implement `tasks.js` with `createTask`, `getTaskById`, `getAllTasks`, `updateTask`, `deleteTask`.
- Write unit assertions using `node:assert` to verify each function.

### Phase 2 — Filtering and sorting
- Implement `filters.js` with `filterByStatus` and `filterByPriority`.
- Implement `sort.js` with `sortByPriority` and `sortByCreatedAt`, each accepting a `desc` flag.
- Compose filters and sort in `tasks.js` via a `queryTasks({ status, priority, sortBy, desc })` helper.

### Phase 3 — Display layer
- Implement `display.js` to format tasks as an aligned table using template literals.
- Add ANSI colour codes: red for `high`, yellow for `medium`, green for `low` priority.
- Handle the empty-list case with a friendly message.

### Phase 4 — CLI interface
- Implement `cli.js` to parse `process.argv` into a command and option flags.
- Map commands to task functions:
  - `add --title "..." [--desc "..."] [--priority low|medium|high]`
  - `list [--status ...] [--priority ...] [--sort priority|date] [--desc]`
  - `update <id> [--title ...] [--desc ...] [--status ...] [--priority ...]`
  - `delete <id>`
- Print usage/help when an unknown command is given.

### Phase 5 — Polish and tests
- Add input validation with clear error messages (missing title, invalid status/priority, unknown ID).
- Write a test suite in `tests/tasks.test.js` using `node:test` and `node:assert`.
- Confirm all user story acceptance criteria pass.

---

## 6. Error Handling Conventions

### General rules
- All errors are represented as thrown `Error` instances with a descriptive `message`.
- No error is swallowed silently; every caught error either re-throws or prints to `stderr` and exits.
- `process.exit(1)` is called only at the CLI boundary (`cli.js`); library modules (`tasks.js`, `filters.js`, etc.) always throw instead.

### Error categories

| Category | Example message | Where thrown |
|---|---|---|
| Validation error | `"Title is required."` | `tasks.js` / `cli.js` |
| Not-found error | `"Task with ID 42 not found."` | `tasks.js` |
| Invalid enum value | `"Invalid status 'done-ish'. Expected: todo, in-progress, done."` | `tasks.js` / `cli.js` |
| Unknown command | `"Unknown command 'remove'. Run with --help for usage."` | `cli.js` |

### CLI error output pattern
```js
try {
  // dispatch command
} catch (err) {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
}
```

---

## 7. Input Validation Rules

All validation runs before any mutation of the in-memory store.

### Task creation (`createTask`)
| Field | Rule |
|---|---|
| `title` | Required. Must be a non-empty string after trimming whitespace. |
| `description` | Optional. If provided, must be a string. |
| `status` | Optional. If provided, must be one of `todo`, `in-progress`, `done`. Defaults to `todo`. |
| `priority` | Optional. If provided, must be one of `low`, `medium`, `high`. Defaults to `medium`. |

### Task update (`updateTask`)
| Field | Rule |
|---|---|
| `id` | Required. Must be a positive integer matching an existing task. |
| `title` | If provided, must be a non-empty string after trimming. |
| `status` | If provided, must be one of the three valid enum values. |
| `priority` | If provided, must be one of the three valid enum values. |

### CLI flag parsing (`cli.js`)
- Any `--priority` or `--status` flag value is validated against the allowed enum before calling the task function.
- Numeric IDs (for `update` and `delete`) are parsed with `Number()` and rejected if `NaN` or non-positive.
- Unknown flags are ignored with a warning to `stderr`; they do not cause a hard exit.

### Validation helper
A shared `validate.js` module under `src/` exposes:
```js
assertNonEmptyString(value, fieldName)  // throws if blank
assertEnum(value, fieldName, allowed)   // throws if not in allowed set
assertPositiveInt(value, fieldName)     // throws if not a positive integer
```
