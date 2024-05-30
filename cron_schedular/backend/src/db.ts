import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./tasks.db');

export interface Task {
    description: string;
    id: string;
    type: string;
    schedule: string;
    executed: boolean;
}

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        type TEXT,
        schedule TEXT,
        description TEXT,
        executed BOOLEAN
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS executionLogs (
        taskId TEXT,
        timestamp TEXT
    )`);
});

export function addTask(task: Task): void {
    const stmt = db.prepare(`INSERT INTO tasks (id, type, schedule, description, executed) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(task.id, task.type, task.schedule, task.description, task.executed, (err: Error) => {
        if (err) {
            console.error('Error inserting task:', err.message);
        } else {
            console.log('Task inserted:', task);
        }
    });
    stmt.finalize();
}

export function getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tasks`, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving tasks:', err.message);
                reject(err);
            } else {
                console.log('Tasks retrieved:', rows);
                resolve(rows as Task[]);
            }
        });
    });
}

export function updateTask(taskId: string, updatedTask: Task): void {
    const stmt = db.prepare(`UPDATE tasks SET type = ?, schedule = ?, description = ?, executed = ? WHERE id = ?`);
    stmt.run(updatedTask.type, updatedTask.schedule, updatedTask.description, updatedTask.executed, taskId, (err: { message: any; }) => {
        if (err) {
            console.error('Error updating task:', err.message);
        } else {
            console.log('Task updated:', taskId, updatedTask);
        }
    });
    stmt.finalize();
}

export function deleteTask(taskId: string): void {
    const stmt = db.prepare(`DELETE FROM tasks WHERE id = ?`);
    stmt.run(taskId, (err) => {
        if (err) {
            console.error('Error deleting task:', err.message);
        } else {
            console.log('Task deleted:', taskId);
        }
    });
    stmt.finalize();
}

export function logExecution(taskId: string, timestamp: Date): void {
    const stmt = db.prepare(`INSERT INTO executionLogs (taskId, timestamp) VALUES (?, ?)`);
    stmt.run(taskId, timestamp.toISOString(), (err: { message: any; }) => {
        if (err) {
            console.error('Error logging execution:', err.message);
        } else {
            console.log('Execution logged for task:', taskId);
        }
    });
    stmt.finalize();
}
