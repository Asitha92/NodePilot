import 'dotenv/config';
import express from 'express';

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import workflowRouter from './routes/workflow/workflowRoutes.ts';
import authRouter from './routes/auth/authRoutes.ts';

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
	.connect(process.env.MONGODB_URI as string)
	.then(() => console.log('MongoDB Connected'))
	.catch((err: unknown) => console.error('MongoDB connection error: ', err));

app.use(
	cors({
		origin: process.env.CLIENT_BASE_URL,
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		optionsSuccessStatus: 200,
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/workflow', workflowRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
