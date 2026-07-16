import { Request, Response } from 'express';
import pool from '../config/db';

// --- TOURS MANAGEMENT ---
export const getTours = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tours ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const createTour = async (req: Request, res: Response) => {
    try {
        const { ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den, mo_ta, thu_vien_anh } = req.body;
        const [result]: any = await pool.query(
            'INSERT INTO tours (ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den, mo_ta, thu_vien_anh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den, mo_ta, thu_vien_anh ? JSON.stringify(thu_vien_anh) : null]
        );
        res.json({ status: 'success', message: 'Đã thêm tour', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const updateTour = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den, mo_ta, thu_vien_anh } = req.body;
        await pool.query(
            'UPDATE tours SET ten_tour=?, hinh_anh=?, phan_tram=?, ngay_khoi_hanh=?, gia_tien_cu=?, gia_tien=?, thoi_gian=?, diem_di=?, diem_den=?, mo_ta=?, thu_vien_anh=? WHERE id=?',
            [ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den, mo_ta, thu_vien_anh ? JSON.stringify(thu_vien_anh) : null, id]
        );
        res.json({ status: 'success', message: 'Đã cập nhật tour' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const deleteTour = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM tours WHERE id=?', [id]);
        res.json({ status: 'success', message: 'Đã xóa tour' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const toggleTourActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await pool.query('UPDATE tours SET is_active=? WHERE id=?', [is_active ? 1 : 0, id]);
        res.json({ status: 'success', message: 'Đã cập nhật trạng thái' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};


// --- RESTAURANTS MANAGEMENT ---
export const getRestaurants = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM restaurants ORDER BY id DESC');
        res.json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien, thu_vien_anh } = req.body;
        const [result]: any = await pool.query(
            'INSERT INTO restaurants (ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien, thu_vien_anh) VALUES (?, ?, ?, ?, ?, ?)',
            [ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien, thu_vien_anh ? JSON.stringify(thu_vien_anh) : null]
        );
        res.json({ status: 'success', message: 'Đã thêm nhà hàng', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien, thu_vien_anh } = req.body;
        await pool.query(
            'UPDATE restaurants SET ten_nha_hang=?, hinh_anh=?, dia_chi=?, mo_ta=?, gia_tien=?, thu_vien_anh=? WHERE id=?',
            [ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien, thu_vien_anh ? JSON.stringify(thu_vien_anh) : null, id]
        );
        res.json({ status: 'success', message: 'Đã cập nhật nhà hàng' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM restaurants WHERE id=?', [id]);
        res.json({ status: 'success', message: 'Đã xóa nhà hàng' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const toggleRestaurantActive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await pool.query('UPDATE restaurants SET is_active=? WHERE id=?', [is_active ? 1 : 0, id]);
        res.json({ status: 'success', message: 'Đã cập nhật trạng thái' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

// --- BOOKINGS MANAGEMENT ---
export const getBookings = async (req: Request, res: Response) => {
    try {
        // Query both Tour and Restaurant bookings, joining to get User and Item details
        const query = `
            SELECT 
                b.id, b.type, b.ngay_dat_di, b.so_luong_khach, b.tong_tien, b.so_tien_da_tra, b.hoan_tien_info, b.trang_thai, b.created_at,
                u.name AS user_name, u.email AS user_email,
                t.ten_tour, r.ten_nha_hang
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN tours t ON b.tour_id = t.id
            LEFT JOIN restaurants r ON b.restaurant_id = r.id
            ORDER BY b.id DESC
        `;
        const [rows] = await pool.query(query);
        res.json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, hoan_tien_info } = req.body;
        if (!['confirmed', 'cancelled', 'pending', 'refunded', 'refund_requested', 'rejected'].includes(status)) {
            return res.status(400).json({ status: 'error', message: 'Trạng thái không hợp lệ' });
        }
        
        if (hoan_tien_info) {
            await pool.query('UPDATE bookings SET trang_thai=?, hoan_tien_info=? WHERE id=?', [status, JSON.stringify(hoan_tien_info), id]);
        } else {
            await pool.query('UPDATE bookings SET trang_thai=? WHERE id=?', [status, id]);
        }
        
        res.json({ status: 'success', message: 'Đã cập nhật trạng thái' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};
