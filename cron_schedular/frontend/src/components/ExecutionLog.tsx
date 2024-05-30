import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/api';

const ExecutionLog: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        const result = await getTasks();
        setTasks(result);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <h2>Execution Log</h2>
            <ul>
                {tasks?.filter((task : any)  => task !== null).map((task : any)  => (
                    <li key={task.id}>
                        <strong>ID:</strong> {task.id} | <strong>Description:</strong> {task.description} | <strong>Executed:</strong> {task.executed.toString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExecutionLog;
