import { Request, Response } from 'express';
import pool from '../config/db';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { user_id, tour_id, restaurant_id, type, ngay_dat_di, so_luong_khach, tong_tien } = req.body;
        
        if (!user_id || !ngay_dat_di || !tong_tien) {
            return res.status(400).json({ status: 'error', message: 'Thiếu thông tin đặt chỗ' });
        }

        const [result]: any = await pool.query(
            'INSERT INTO bookings (user_id, tour_id, restaurant_id, type, ngay_dat_di, so_luong_khach, tong_tien) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, tour_id || null, restaurant_id || null, type || 'tour', ngay_dat_di, so_luong_khach || 1, tong_tien]
        );

        res.json({
            status: 'success',
            message: 'Đặt tour thành công',
            data: { id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const query = `
            SELECT 
                b.id, b.type, b.ngay_dat_di, b.so_luong_khach, b.tong_tien, b.trang_thai, b.created_at,
                t.ten_tour, t.hinh_anh AS tour_img,
                r.ten_nha_hang, r.hinh_anh AS restaurant_img
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.id
            LEFT JOIN restaurants r ON b.restaurant_id = r.id
            WHERE b.user_id = ?
            ORDER BY b.id DESC
        `;
        const [rows] = await pool.query(query, [userId]);
        res.json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};
