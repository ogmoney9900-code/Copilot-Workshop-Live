import {
  createTask,
  getAllTasks,
  getTaskById,
  queryTasks,
  updateTask,
  deleteTask,
} from './services/taskService.js';
import { colorStatus, colorPriority } from './utils/colors.js';

// --- Create tasks ---
console.log('=== Creating tasks ===');
const t1 = createTask({ title: 'Write project plan', priority: 'high' });
const t2 = createTask({ title: 'Design schema', description: 'Draft the data model', priority: 'high', status: 'in-progress' });
const t3 = createTask({ title: 'Implement CLI', priority: 'medium' });
const t4 = createTask({ title: 'Write tests', priority: 'low' });
console.log('Created:', [t1, t2, t3, t4].map(t => t.title));

// --- List all tasks ---
console.log('\n=== All tasks ===');
getAllTasks().forEach(t => console.log(`  [${colorPriority(t.priority)}] ${t.title} (${colorStatus(t.status)})`));

// --- Get task by ID ---
console.log('\n=== Get task by ID ===');
const found = getTaskById(t1.id);
console.log('Found:', found.title, '| status:', colorStatus(found.status));

// --- Filter by status ---
console.log('\n=== Filter: status=in-progress ===');
queryTasks({ status: 'in-progress' }).forEach(t => console.log(' ', t.title));

// --- Filter by priority ---
console.log('\n=== Filter: priority=high ===');
queryTasks({ priority: 'high' }).forEach(t => console.log(' ', t.title));

// --- Sort by priority (high → low) ---
console.log('\n=== Sort by priority (high first) ===');
queryTasks({ sortBy: 'priority' }).forEach(t => console.log(`  [${colorPriority(t.priority)}] ${t.title}`));

// --- Sort by createdAt descending (newest first) ---
console.log('\n=== Sort by createdAt descending ===');
queryTasks({ sortBy: 'createdAt', desc: true }).forEach(t => console.log(' ', t.title));

// --- Update a task ---
console.log('\n=== Update task ===');
const updated = updateTask(t3.id, { status: 'in-progress', priority: 'high' });
console.log('Updated:', updated.title, '→ status:', colorStatus(updated.status), '| priority:', colorPriority(updated.priority));

// --- Delete a task ---
console.log('\n=== Delete task ===');
const deleted = deleteTask(t4.id);
console.log('Deleted:', deleted.title);
console.log('Remaining task count:', getAllTasks().length);

// --- Error handling ---
console.log('\n=== Error handling ===');
try {
  createTask({ title: '   ' });
} catch (err) {
  console.error('Expected error (blank title):', err.message);
}

try {
  createTask({ title: 'Valid', status: 'invalid-status' });
} catch (err) {
  console.error('Expected error (bad status):', err.message);
}

try {
  getTaskById('nonexistent-uuid');
} catch (err) {
  console.error('Expected error (not found):', err.message);
}

try {
  updateTask('nonexistent-uuid', { title: 'New title' });
} catch (err) {
  console.error('Expected error (update not found):', err.message);
}
