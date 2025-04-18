"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TaskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    reminderAt: { type: Date, default: null },
    notified: { type: Boolean, default: false }
}, { timestamps: true });
const Task = mongoose_1.default.model("Task", TaskSchema);
exports.default = Task;
