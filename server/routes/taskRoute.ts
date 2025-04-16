import express, { Request ,Response} from "express"
import Task from "../models/TaskModel"
import authMiddleWare from "../middlewares/auth"
import mongoose from "mongoose"

const taskRouter = express.Router()

//Get user task
const GetUserTask =  async (req:Request, res:Response) : Promise<string | any> =>{
    try {
        const tasks = await Task.find({user:req.userId})
        res.json({tasks});
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch tasks' });
    }
}

//create user task
const CreateUserTask = async (req:Request, res:Response) :Promise<string | any> =>{
    try {
        // const { title,description,status,reminderAt } = req.body
        const task = await Task.create({...req.body, user:req.userId})

        // const newTask = new Task({
        //     title,
        //     description,
        //     status,
        //     user:req.userId,
        //     reminderAt: reminderAt ? new Date(reminderAt) : null,
        //     notified:false,
        // })
        // await newTask.save()
        return res.status(200).json({task,message:'New Task added successfully'})
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch tasks' });
    }
}

//update user Task
const UpdateTask = async (req:Request, res:Response) :Promise <string | any> =>{
    try {
        const {title, description, status, reminderAt} = req.body

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }
        const existingTask = await Task.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        const task = await Task.findByIdAndUpdate({ _id: req.params.id, user: req.userId },
            {
              ...(title && { title }),
              ...(description && { description }),
              ...(status && { status }),
              ...(reminderAt !== undefined && { reminderAt: reminderAt ? new Date(reminderAt) : null }),
              notified: false, // reset notified when reminder is changed
            }, {new : true})//note we are req the _id of the task not the user.
        
            
            if (!task) {
                return res.status(404).json({ message: "Task not found or unauthorized" });
            }

        return res.status(200).json({
            task,
            message: 'Task updated successfully',
        })
    } catch (error) {
        return res.status(500).json({message : "Failed to update tasks"})
    }
}

//delete tasks
const DeleteTask = async (req:Request, res:Response) :Promise <string | any> =>{
    try {
        await Task.findByIdAndDelete(req.params.id)//this is the id of the task
        res.json({message:'Task deleted successfully'})
    } catch (error) {
        return res.status(500).json({message : "Failed to delete tasks"})
    }
}

taskRouter.route("/get_Tasks").get(authMiddleWare,GetUserTask)
taskRouter.route("/create_Task").post(authMiddleWare,CreateUserTask)
taskRouter.route("/update_Task/:id").patch(authMiddleWare,UpdateTask)
taskRouter.route("/delete_Task/:id").delete(authMiddleWare,DeleteTask)

export {taskRouter}
