import pool from '../config/db';

const updateDatabase = async () => {
    try {
        console.log('🔄 Đang cập nhật database...');

        // 1. Thêm cột is_active cho tours
        try {
            await pool.query('ALTER TABLE tours ADD COLUMN is_active BOOLEAN DEFAULT TRUE;');
            console.log('✅ Đã thêm is_active vào tours');
        } catch (e: any) {
            console.log('⚠️ Cột is_active đã tồn tại trong tours hoặc lỗi:', e.message);
        }

        // 2. Thêm cột is_active cho restaurants
        try {
            await pool.query('ALTER TABLE restaurants ADD COLUMN is_active BOOLEAN DEFAULT TRUE;');
            console.log('✅ Đã thêm is_active vào restaurants');
        } catch (e: any) {
            console.log('⚠️ Cột is_active đã tồn tại trong restaurants hoặc lỗi:', e.message);
        }

        // 3. Sửa bảng bookings: đổi tour_id thành NULLable, thêm restaurant_id, type
        try {
            await pool.query('ALTER TABLE bookings MODIFY COLUMN tour_id INT NULL;');
            await pool.query('ALTER TABLE bookings ADD COLUMN restaurant_id INT NULL;');
            await pool.query('ALTER TABLE bookings ADD COLUMN type VARCHAR(50) DEFAULT "tour";');
            await pool.query('ALTER TABLE bookings ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);');
            console.log('✅ Đã cập nhật cấu trúc bảng bookings');
        } catch (e: any) {
            console.log('⚠️ Bảng bookings đã được cập nhật trước đó hoặc lỗi:', e.message);
        }

        console.log('🎉 Cập nhật database thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi cập nhật DB:', error);
        process.exit(1);
    }
};

updateDatabase();
