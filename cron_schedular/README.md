# Distributed Task Scheduler

This distributed task scheduler allows clients to register, schedule, and manage one-time and recurring tasks. It ensures tasks are executed at their specified times and supports CRUD operations for task management.

## Features

- RESTful API for task management (create, read, update, delete)
- In-memory task scheduling for simplicity
- Lightweight SQLite database for task storage
- Easy scalability and fault tolerance

## Components

- API Gateway: Handles client requests and task management
- Task Scheduler Service: Schedules tasks based on specified times
- Task Executor Service: Executes tasks and logs execution details
- Task Storage: Stores task definitions and execution logs
- Monitoring and Logging: Monitors system health and centralizes logs

## Technology Stack

- Node.js
- Express.js
- SQLite

### Docker 

Run command
`docker-compose build`

### Install dependencies:

### For Backend, go to the backend folder

`cd backend`

### To install the dependencies for the backend, use this command

`npm install`

### To run the backend, open the package.json file, hover the start and build command

### For Frontend, go to the frontend folder, 
`cd ../`

`cd frontend`

`npm install`

### Run the application:

First run the backend from package.json --> run script || build, check package.json

### For Backend

`npm start`

### For Frontend

`npm start`

### API Endpoints

- Task Management

  - Create a task:
    `POST /tasks`
  - Request body:  
     `{
    "id": “1”,
    "type": "one-time",
    "schedule": "2024-05-23T15:30:00Z",
    "description": "Test task 1”,
    }

- Get all tasks:
  `Get /tasks`
- Update a task:
  `PUT /tasks`
  `{
  "id": "1",
  "type": "one-time",
  "schedule": "2024-05-23T15:30:00Z",
  "description": "Description"
  }
- Delete a task:
  ` DELETE /tasks/:id`


### Scaling and Considerations

- API Gateway: Can be scaled horizontally by adding more instances behind a load balancer.
- Task Scheduler and Executor: Can be distributed across multiple nodes to handle more tasks.
- Task Storage: SQLite is suitable for moderate loads; for higher loads, consider migrating to PostgreSQL or MongoDB.

### Future Enhancements

- Integrate with monitoring tools like Prometheus and Grafana for better metrics.
- Use a distributed message queue like RabbitMQ or Kafka for better task distribution.
- Implement authentication and authorization for API endpoints.

