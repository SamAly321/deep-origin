import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks`);
        return response.data.tasks;
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        throw error;
    }
};

export const createTask = async (task: any) => {
    try {
        const response = await axios.post(`${API_URL}/tasks`, task);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (taskId: string, task: any) => {
    try {
        const response = await axios.put(`${API_URL}/tasks/${taskId}`, task);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        await axios.delete(`${API_URL}/tasks/${taskId}`);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};
