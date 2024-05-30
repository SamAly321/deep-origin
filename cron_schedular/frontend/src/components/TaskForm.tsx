import React, { useState } from 'react';
import { createTask, updateTask } from '../services/api';

interface TaskFormProps {
    task?: any;
    onSubmit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
    const [formData, setFormData] = useState(task || {
        id: '',
        type: '',
        schedule: '',
        description: '',
        executed: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (task) {
            await updateTask(task.id, formData);
        } else {
            await createTask(formData);
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>ID:</label>
                <input type="text" name="id" value={formData.id} onChange={handleChange} />
            </div>
            <div>
                <label>Type:</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="one-time">One-Time</option>
                    <option value="recurring">Recurring</option>
                </select>
            </div>
            <div>
                <label>Schedule:</label>
                <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskForm;
