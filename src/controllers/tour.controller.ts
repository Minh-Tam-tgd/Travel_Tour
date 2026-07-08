import { Request, Response } from 'express';
import pool from '../config/db';

export const getAllTours = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tours');
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

export const getTourById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows]: any = await pool.query('SELECT * FROM tours WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy tour'
            });
        }
        
        res.json({
            status: 'success',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server'
        });
    }
};
