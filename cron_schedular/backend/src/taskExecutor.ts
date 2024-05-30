import { logExecution, updateTask, Task } from './db';

function executeTask(task: Task): void {
    console.log(`Executing task: ${task.id}`);
    logExecution(task.id, new Date());
    if (task.type === 'one-time') {
        task.executed = true;
        updateTask(task.id, task);
    }
}

export default { executeTask };
