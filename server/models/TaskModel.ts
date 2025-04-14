import mongoose from "mongoose";
import { ITask } from "../types/definitions";

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: {type:String},
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
