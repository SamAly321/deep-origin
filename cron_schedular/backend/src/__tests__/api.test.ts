import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import db from '../db';
import taskScheduler from '../taskScheduler';
import taskExecutor from '../taskExecutor';
import cors from 'cors';

// Mock the database and scheduler methods
jest.mock('../db');
jest.mock('../taskScheduler');
jest.mock('../taskExecutor');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/tasks', async (req, res) => {
    const task = req.body;
    if (!task.id || !task.type || !task.schedule || !task.description) {
        return res.status(400).send({ error: 'Task must have id, type, schedule, and description' });
    }
    try {
        db.addTask(task);
        taskScheduler.scheduleTask(task);
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add task' });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await db.getTasks();
        res.status(200).send({ tasks });
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve tasks' });
    }
});

app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;
    if (!updatedTask.type || !updatedTask.schedule || !updatedTask.description) {
        return res.status(400).send({ error: 'Updated task must have type, schedule, and description' });
    }
    try {
        db.updateTask(taskId, updatedTask);
        taskScheduler.rescheduleTask(taskId, updatedTask);
        res.status(200).send(updatedTask);
    } catch (error) {
        res.status(500).send({ error: 'Failed to update task' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    try {
        db.deleteTask(taskId);
        taskScheduler.cancelTask(taskId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete task' });
    }
});

describe('Task API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a task', async () => {
        const task = {
            id: '1',
            type: 'one-time',
            schedule: '2024-06-01T00:00:00Z',
            description: 'Test task',
            executed: false
        };
        const response = await request(app).post('/tasks').send(task);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(task);
        expect(db.addTask).toHaveBeenCalledWith(task);
        expect(taskScheduler.scheduleTask).toHaveBeenCalledWith(task);
    });

    test('should retrieve tasks', async () => {
        const tasks = [
            {
                id: '1',
                type: 'one-time',
                schedule: '2024-06-01T00:00:00Z',
                description: 'Test task',
                executed: false
            }
        ];
        (db.getTasks as jest.Mock).mockResolvedValue(tasks);
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body.tasks).toEqual(tasks);
    });

    test('should update a task', async () => {
        const updatedTask = {
            id: '1',
            type: 'one-time',
            schedule: '2024-06-01T00:00:00Z',
            description: 'Updated task',
            executed: false
        };
        const response = await request(app).put('/tasks/1').send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedTask);
        expect(db.updateTask).toHaveBeenCalledWith('1', updatedTask);
        expect(taskScheduler.rescheduleTask).toHaveBeenCalledWith('1', updatedTask);
    });

    test('should delete a task', async () => {
        const response = await request(app).delete('/tasks/1');
        expect(response.status).toBe(204);
        expect(db.deleteTask).toHaveBeenCalledWith('1');
        expect(taskScheduler.cancelTask).toHaveBeenCalledWith('1');
    });
});
