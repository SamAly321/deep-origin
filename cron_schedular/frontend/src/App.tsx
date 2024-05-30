import React from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ExecutionLog from './components/ExecutionLog';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Distributed Task Scheduler</h1>
            <TaskForm onSubmit={() => {}} />
            <TaskList />
            <ExecutionLog />
        </div>
    );
};

export default App;
