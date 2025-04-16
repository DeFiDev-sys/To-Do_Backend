import cron from 'node-cron'
import nodemailer from 'nodemailer'
import Task from '../models/TaskModel'
import dotenv from "dotenv"
import { ITask } from '../types/definitions'


dotenv.config();


export const sendReminderEmails = async() =>{
    const now = new Date();

    const upComingTask = await Task.find({
        reminderAt:{$lte:now},
        notified:{$ne:true}
    }).populate('User')

    // if (upComingTask.length === 0) {
    //     console.log("No reminders due yet.");
    // }

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    for(const task of upComingTask as ITask[]){
        const user = task.user;

        const html = `
            <html>
                <body>
                    <h1>Reminder</h1>
                    <p>Don't forget to do your task!, Dear ${user.name}</p>
                    <p>Just a reminder for task: ${task.description}</p>
                    <p>Reminder set for: ${task.reminderAt}</p>
                </body>
            </html>
        `

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: `Reminder: ${task.title}`,
            html: html
        })

        task.notified=true;
        await task.save();
    }
}


cron.schedule("* * * * *", sendReminderEmails);

