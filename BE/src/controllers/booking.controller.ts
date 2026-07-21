import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { user_id, tour_id, restaurant_id, type, ngay_dat_di, so_luong_khach, tong_tien, so_tien_da_tra, minh_chung_thanh_toan } = req.body;
        
        if (!user_id || !ngay_dat_di || !tong_tien) {
            return res.status(400).json({ status: 'error', message: 'Thiếu thông tin đặt chỗ' });
        }

        const [result]: any = await pool.query(
            'INSERT INTO bookings (user_id, tour_id, restaurant_id, type, ngay_dat_di, so_luong_khach, tong_tien, so_tien_da_tra, minh_chung_thanh_toan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, tour_id || null, restaurant_id || null, type || 'tour', ngay_dat_di, so_luong_khach || 1, tong_tien, so_tien_da_tra || tong_tien, minh_chung_thanh_toan || null]
        );

        res.json({
            status: 'success',
            message: 'Đặt chỗ thành công',
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
                b.id, b.type, b.ngay_dat_di, b.so_luong_khach, b.tong_tien, b.so_tien_da_tra, b.hoan_tien_info, b.minh_chung_thanh_toan, b.trang_thai, b.created_at,
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

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result]: any = await pool.query('UPDATE bookings SET trang_thai = "cancelled" WHERE id = ? AND trang_thai = "pending"', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(400).json({ status: 'error', message: 'Không thể hủy đơn hàng này (có thể đã duyệt hoặc không tồn tại)' });
        }
        
        res.json({ status: 'success', message: 'Đã hủy đơn hàng' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};

export const refundBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password, stk, ten_nh, cccd } = req.body;

        // Lấy thông tin user
        const [bookings]: any = await pool.query('SELECT user_id, trang_thai FROM bookings WHERE id = ?', [id]);
        if (bookings.length === 0) return res.status(404).json({ status: 'error', message: 'Không tìm thấy đơn' });
        if (bookings[0].trang_thai !== 'confirmed') return res.status(400).json({ status: 'error', message: 'Chỉ có thể yêu cầu hoàn tiền cho đơn đã được duyệt' });
        
        const userId = bookings[0].user_id;

        const [users]: any = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ status: 'error', message: 'Không tìm thấy user' });

        const isValid = await bcrypt.compare(password, users[0].password);
        if (!isValid) return res.status(400).json({ status: 'error', message: 'Mật khẩu không chính xác' });

        const hoanTienInfo = JSON.stringify({ stk, ten_nh, cccd });

        await pool.query('UPDATE bookings SET trang_thai = "refund_requested", hoan_tien_info = ? WHERE id = ?', [hoanTienInfo, id]);
        
        res.json({ status: 'success', message: 'Đã gửi yêu cầu hoàn tiền' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi server' });
    }
};
