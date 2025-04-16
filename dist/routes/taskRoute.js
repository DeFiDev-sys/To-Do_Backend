"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const taskRouter = express_1.default.Router();
exports.taskRouter = taskRouter;
//Get user task
const GetUserTask = async (req, res) => {
    try {
        const tasks = await TaskModel_1.default.find({ user: req.userId });
        res.json({ tasks });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};
//create user task
const CreateUserTask = async (req, res) => {
    try {
        // const { title,description,status,reminderAt } = req.body
        const task = await TaskModel_1.default.create({ ...req.body, user: req.userId });
        // const newTask = new Task({
        //     title,
        //     description,
        //     status,
        //     user:req.userId,
        //     reminderAt: reminderAt ? new Date(reminderAt) : null,
        //     notified:false,
        // })
        // await newTask.save()
        return res.status(200).json({ task, message: 'New Task added successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};
//update user Task
const UpdateTask = async (req, res) => {
    try {
        const { title, description, status, reminderAt } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const existingTask = await TaskModel_1.default.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        const task = await TaskModel_1.default.findByIdAndUpdate({ _id: req.params.id, user: req.userId }, {
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
            ...(reminderAt !== undefined && { reminderAt: reminderAt ? new Date(reminderAt) : null }),
            notified: false, // reset notified when reminder is changed
        }, { new: true }); //note we are req the _id of the task not the user.
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        return res.status(200).json({
            task,
            message: 'Task updated successfully',
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to update tasks" });
    }
};
//delete tasks
const DeleteTask = async (req, res) => {
    try {
        await TaskModel_1.default.findByIdAndDelete(req.params.id); //this is the id of the task
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to delete tasks" });
    }
};
taskRouter.route("/get_Tasks").get(auth_1.default, GetUserTask);
taskRouter.route("/create_Task").post(auth_1.default, CreateUserTask);
taskRouter.route("/update_Task/:id").patch(auth_1.default, UpdateTask);
taskRouter.route("/delete_Task/:id").delete(auth_1.default, DeleteTask);
