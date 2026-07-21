import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic route test
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
    });
});

// Import Routes
app.use('/api/client', routes);
app.use('/api/admin', adminRoutes);
// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'error',
        message: 'Not found',
    });
});

export default app;
