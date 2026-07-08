import { Request, Response } from 'express';
import pool from '../config/db';

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM restaurants');
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server'
        });
    }
};
