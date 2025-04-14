import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { authrouter } from './routes/auths';
import { taskRouter } from './routes/taskRoute';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());

// Initialize DB
connectDB();

app.use("/api/auth",authrouter)
app.use("/api/tasks",taskRouter)

// Routes testing the api
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});