"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReminderEmails = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const TaskModel_1 = __importDefault(require("../models/TaskModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendReminderEmails = async () => {
    const now = new Date();
    const upComingTask = await TaskModel_1.default.find({
        reminderAt: { $lte: now },
        notified: { $ne: true }
    }).populate('user');
    // if (upComingTask.length === 0) {
    //     console.log("No reminders due yet.");
    // }
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    for (const task of upComingTask) {
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
        `;
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: `Reminder: ${task.title}`,
            html: html
        });
        task.notified = true;
        await task.save();
    }
};
exports.sendReminderEmails = sendReminderEmails;
node_cron_1.default.schedule("* * * * *", exports.sendReminderEmails);
