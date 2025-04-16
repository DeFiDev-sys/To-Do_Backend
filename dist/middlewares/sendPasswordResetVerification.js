"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendPasswordResetEmail = (resetToken, name, email) => {
    const html = `
        <html>
            <body>
            <h1>Reset your password</h1>
                <h3>Dear ${name}</h3>
                <p>Click on the link to reset your password</p>
                <a href="https://to-do-frontend-theta.vercel.app/reset-password?token=${resetToken}">Click Here!</a>
            </body>
        </html>
    `;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    const mailOptions = {
        from: "SupportTeam@gmail.com",
        to: email,
        subject: "To-Do List reset password request",
        html: html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Email sent to ${email}`);
            console.log(info.response);
        }
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
