const express = require('express');

const app = express();
const PORT = 3000;

// This allows us to read JSON data from the request body
app.use(express.json());

// We will store our tasks in this array for now
let tasks = [];
let nextId = 1; // Simple way to give each task a unique ID

// 1. Add Task (Create)
// We send data in the body to create a task
app.post('/api/tasks', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    // Check if title is missing
    if (!title) {
        return res.status(400).json({ message: "Please provide a task title" });
    }

    // Create a new task object
    const newTask = {
        id: nextId,
        title: title,
        description: description,
        status: "pending"
    };

    // Increase the id for the next time we add a task
    nextId++;

    // Add it to our array
    tasks.push(newTask);

    // Send the created task back to the user
    res.status(201).json(newTask);
});

// 2. Get All Tasks (Read)
// Simply return the whole array
app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 3. Get a Specific Task (Read)
// Find a task by its ID
app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID string from URL to a number

    // Loop through tasks to find the one we want
    let foundTask = null;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            foundTask = tasks[i];
            break;
        }
    }

    // If we didn't find it
    if (!foundTask) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(foundTask);
});

// 4. Update a Task (Update)
// Update an existing task's details
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    // Find the index of the task in our array
    let taskIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            taskIndex = i;
            break;
        }
    }

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    // Update the task data
    if (req.body.title) {
        tasks[taskIndex].title = req.body.title;
    }
    if (req.body.description) {
        tasks[taskIndex].description = req.body.description;
    }
    if (req.body.status) {
        tasks[taskIndex].status = req.body.status;
    }

    res.status(200).json(tasks[taskIndex]);
});

// 5. Delete a Task (Delete)
// Remove a task from the array
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    // Find the index of the task
    let taskIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            taskIndex = i;
            break;
        }
    }

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    // Remove 1 item at taskIndex
    tasks.splice(taskIndex, 1);

    res.status(200).json({ message: "Task deleted successfully" });
});

// Start our server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
