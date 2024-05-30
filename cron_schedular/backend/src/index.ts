import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { addTask, getTasks, updateTask, deleteTask, Task } from './db';
import taskScheduler from './taskScheduler';
import taskExecutor from './taskExecutor';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/tasks', async (req: Request, res: Response) => {
    const task: Task = req.body;
    if (!task.id || !task.type || !task.schedule || !task.description) {
        console.error('Error: Missing required task fields');
        return res.status(400).send({ error: 'Task must have id, type, schedule, and description' });
    }
    try {
        addTask(task);
        taskScheduler.scheduleTask(task);
        console.log('Task added:', task);
        res.status(201).send(task);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send({ error: 'Failed to add task' });
    }
});

app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const tasks = await getTasks();
        console.log('Retrieved tasks:', tasks);
        res.status(200).send({ tasks });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).send({ error: 'Failed to retrieve tasks' });
    }
});

app.put('/tasks/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    const updatedTask: Task = req.body;
    if (!updatedTask.type || !updatedTask.schedule || !updatedTask.description) {
        console.error('Error: Missing required fields for updating task');
        return res.status(400).send({ error: 'Updated task must have type, schedule, and description' });
    }
    try {
        updateTask(taskId, updatedTask);
        taskScheduler.rescheduleTask(taskId, updatedTask);
        console.log('Task updated:', taskId, updatedTask);
        res.status(200).send(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send({ error: 'Failed to update task' });
    }
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskId = req.params.id;
    try {
        deleteTask(taskId);
        taskScheduler.cancelTask(taskId);
        console.log('Task deleted:', taskId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send({ error: 'Failed to delete task' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
