import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { NODE_ENV, ORIGIN, PORT } from './config/env.js';
import connectToDB from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import contactRouter from './routes/contact.routes.js';
import serverSocket from './socket.js';
import messageRouter from './routes/messagesRoutes.js';
import channelRouter from './routes/channel.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({
    origin: [ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"],
    credentials: true,
}));

app.use("/uploads/profiles",express.static(path.join(__dirname, "uploads/profiles")));
app.use("/uploads/files", express.static(path.join(__dirname, "uploads/files")));

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/contacts',contactRouter);
app.use('/api/v1/messages',messageRouter);
app.use('/api/v1/channels', channelRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(errorMiddleware);

const server = app.listen(PORT,async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    await connectToDB();
});

serverSocket(server);

export default app;