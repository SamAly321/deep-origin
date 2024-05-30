import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/api';
import TaskForm from './TaskForm';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [editingTask, setEditingTask] = useState<any | null>(null);
    const [fetch, setFetch] = useState<Boolean>(false)

    const fetchTasks = async () => {
        const result = await getTasks();
        setTasks(result);
    };

    useEffect(() => {
        fetchTasks();
    }, [fetch]);

    const handleDelete = async (taskId: string) => {
        await deleteTask(taskId);
        setFetch(true);
    };

    const handleEdit = (task: any) => {
        setEditingTask(task);
        setFetch(true);
    };

    const handleFormSubmit = () => {
        setEditingTask(null);
        setFetch(true);
    };

    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks?.filter(task => task).map(task => (
                    <li key={task.id}>
                        <strong>ID:</strong> {task.id} | <strong>Description:</strong> {task.description} | <strong>Type:</strong> {task.type} | <strong>Schedule:</strong> {task.schedule} | <strong>Executed:</strong> {task.executed.toString()}
                        <button onClick={() => handleEdit(task)}>Edit</button>
                        <button onClick={() => handleDelete(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {editingTask && <TaskForm task={editingTask} onSubmit={handleFormSubmit} />}
        </div>
    );
};

export default TaskList;
