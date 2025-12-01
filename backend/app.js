import express from 'express';
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';
import projectRoutes from './routes/project.routes.js';
import deployRoutes from './routes/deploy.routes.js';
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/users', userRouter);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes);
app.use('/deploy', deployRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

export default app;