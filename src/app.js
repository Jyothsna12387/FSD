 import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';
import leaveRoutes from './routes/leave.routes.js';
import roomChangeRoutes from './routes/roomChange.routes.js'; 
import roomApplicationRoutes from './routes/roomApplication.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1', roomChangeRoutes);
app.use('/api/v1/room-application', roomApplicationRoutes);

// Error Handling
app.use(errorHandler);

export default app;
