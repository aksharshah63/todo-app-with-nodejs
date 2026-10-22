import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import {
    createTask,
    deleteTask,
    listTasks,
    renderEditTask,
    updateTask,
} from './controllers/taskController.js';

const app = express();
const publicPath = path.resolve('public');

app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", listTasks);
app.get("/add", (req, res) => res.render("add"));
app.post("/tasks", createTask);
app.get("/tasks/:id/edit", renderEditTask);
app.post("/tasks/:id", updateTask);
app.post("/tasks/:id/delete", deleteTask);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send("Something went wrong. Please try again.");
});

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-app";
const port = Number(process.env.PORT) || 3000;

mongoose.connect(mongoUri)
    .then(() => {
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    })
    .catch((error) => {
        console.error("Unable to connect to MongoDB:", error);
        process.exitCode = 1;
    });