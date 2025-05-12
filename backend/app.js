import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { NODE_ENV, ORIGIN, PORT } from './config/env.js';
import connectToDB from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.use(cors({
    origin: [ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(errorMiddleware);

app.listen(PORT,async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    await connectToDB();
});

export default app;