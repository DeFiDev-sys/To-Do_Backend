"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const auths_1 = require("./routes/auths");
const taskRoute_1 = require("./routes/taskRoute");
const reminderScheduler_1 = require("./middlewares/reminderScheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
// Initialize DB
(0, db_1.default)();
(0, reminderScheduler_1.sendReminderEmails)(); //reminder for task via email
app.use("/api/auth", auths_1.authrouter);
app.use("/api/tasks", taskRoute_1.taskRouter);
// Routes testing the api
app.get('/', (req, res) => {
    res.send('API is running');
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
