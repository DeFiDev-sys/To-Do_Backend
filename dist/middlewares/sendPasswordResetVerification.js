"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
//abof derc vgrw fogz
//juwonjay2001@gmail.com
const sendPasswordResetEmail = (resetToken, name, email) => {
    const html = `
        <html>
            <body>
            <h1>Reset your password</h1>
                <h3>Dear ${name}</h3>
                <p>Click on the link to reset your password</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}">Click Here!</a>
            </body>
        </html>
    `;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "juwonjay2001@gmail.com",
            pass: "abof derc vgrw fogz",
        },
    });
    const mailOptions = {
        from: "jayTechsSupport@gmail.com",
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
