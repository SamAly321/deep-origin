import taskExecutor from './taskExecutor';
import { Task } from './db';

let scheduledTasks: { [key: string]: NodeJS.Timeout } = {};

function scheduleTask(task: Task): void {
    const delay = new Date(task.schedule).getTime() - new Date().getTime();
    const timeoutId = setTimeout(() => {
        taskExecutor.executeTask(task);
        if (task.type === 'recurring') {
            scheduleTask(task);
        } else {
            delete scheduledTasks[task.id];
        }
    }, delay);
    scheduledTasks[task.id] = timeoutId;
}

function rescheduleTask(taskId: string, updatedTask: Task): void {
    cancelTask(taskId);
    scheduleTask(updatedTask);
}

function cancelTask(taskId: string): void {
    if (scheduledTasks[taskId]) {
        clearTimeout(scheduledTasks[taskId]);
        delete scheduledTasks[taskId];
    }
}

export default { scheduleTask, rescheduleTask, cancelTask };
