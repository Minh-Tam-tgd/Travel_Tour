import pool from '../config/db';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        console.log('🌱 Bắt đầu quá trình seed dữ liệu...');

        // 1. Clear bảng cũ (Tùy chọn, cần cẩn thận nếu có data thật, ở đây chỉ để chắc chắn chèn được)
        // Vì có khóa ngoại nên ta phải disable khóa ngoại trước
        await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
        await pool.query('TRUNCATE TABLE bookings;');
        await pool.query('TRUNCATE TABLE tours;');
        await pool.query('TRUNCATE TABLE restaurants;');
        await pool.query('TRUNCATE TABLE users;');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('✅ Đã làm sạch dữ liệu cũ');

        // 2. Seed Users
        const salt = await bcrypt.genSalt(10);
        const hashAdmin = await bcrypt.hash('admin123', salt);
        const hashUser = await bcrypt.hash('user123', salt);
        
        await pool.query(`
            INSERT INTO users (name, email, password, role) VALUES 
            ('Admin User', 'admin@example.com', ?, 'admin'),
            ('Nguyễn Văn A', 'nguyenvana@example.com', ?, 'user')
        `, [hashAdmin, hashUser]);
        console.log('✅ Đã thêm dữ liệu Users');

        // 3. Seed Tours (lấy từ demoTours FE)
        const toursData = [
            ["Tour Minh Tâm - Hạ Long 3 ngày", "../../assets/images/anh1.jpg", 20, "2026-07-01", 6200000, 4990000, "3N2Đ", "Hà Nội", "Hạ Long"],
            ["Tour Đà Nẵng - Hội An - Cù Lao Chàm", "../../assets/images/anh1.jpg", 15, "2026-07-05", 7200000, 6250000, "4N3Đ", "Đà Nẵng", "Hội An"],
            ["Khám Phá Nha Trang - Biển Đảo", "../../assets/images/anh1.jpg", 10, "2026-07-10", 5900000, 5190000, "3N2Đ", "TP.HCM", "Nha Trang"],
            ["Du Lịch Sapa - Bản Cát Cát - Fansipan", "../../assets/images/anh1.jpg", 25, "2026-07-12", 3900000, 2690000, "2N1Đ", "Hà Nội", "Sapa"],
            ["Phú Quốc - VinWonders - Safari", "../../assets/images/anh1.jpg", 10, "2026-08-10", 8500000, 7100000, "4N3Đ", "TP.HCM", "Phú Quốc"],
            ["Tour Miền Tây 1 Ngày: Mỹ Tho - Bến Tre", "../../assets/images/anh1.jpg", 5, "Hàng ngày", 900000, 850000, "1N", "TP.HCM", "Bến Tre"]
        ];

        for (const tour of toursData) {
            await pool.query(`
                INSERT INTO tours (ten_tour, hinh_anh, phan_tram, ngay_khoi_hanh, gia_tien_cu, gia_tien, thoi_gian, diem_di, diem_den) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, tour);
        }
        console.log('✅ Đã thêm dữ liệu Tours');

        // 4. Seed Restaurants (lấy từ demoNhaHang FE)
        const restaurantsData = [
            ["Nhà Hàng Buffet Sen Tây Hồ", "../../assets/images/buffet.jpg", "Hà Nội", "Buffet cao cấp với hàng trăm món ngon 3 miền.", 450000],
            ["Lẩu Phan", "../../assets/images/lau.jpg", "Hà Nội", "Lẩu bò úc thả ga, không lo về giá.", 169000],
            ["King BBQ", "../../assets/images/nuong.jpg", "TP.HCM", "Vua nướng Hàn Quốc, thịt nướng thơm ngon.", 300000],
            ["Nhà Hàng Hải Sản Biển Đông", "../../assets/images/haisan.jpg", "Đà Nẵng", "Hải sản tươi sống, chế biến tại chỗ.", 500000],
            ["Gogi House", "../../assets/images/han.jpg", "Hà Nội", "Thịt nướng không khói chuẩn vị Hàn.", 250000],
            ["Quán Nhậu Tự Do", "../../assets/images/quannhau.jpg", "Hà Nội", "Không gian thoáng mát, đồ nhậu đa dạng.", 200000],
            ["Sushi Kei", "../../assets/images/nhat.jpg", "TP.HCM", "Sushi và sashimi tươi ngon chuẩn Nhật.", 400000],
            ["Cơm Niêu Việt", "../../assets/images/viet.jpg", "Đà Nẵng", "Món ngon đậm đà hương vị truyền thống Việt Nam.", 150000],
            ["Kichi Kichi", "../../assets/images/lau.jpg", "TP.HCM", "Lẩu băng chuyền độc đáo.", 250000]
        ];

        for (const res of restaurantsData) {
            await pool.query(`
                INSERT INTO restaurants (ten_nha_hang, hinh_anh, dia_chi, mo_ta, gia_tien) 
                VALUES (?, ?, ?, ?, ?)
            `, res);
        }
        console.log('✅ Đã thêm dữ liệu Restaurants');

        // 5. Seed Bookings (Tạo 1 đơn đặt hàng mẫu cho user 2 đặt tour 1)
        await pool.query(`
            INSERT INTO bookings (user_id, tour_id, ngay_dat_di, so_luong_khach, tong_tien, trang_thai) 
            VALUES (2, 1, '2026-07-20', 2, 9980000, 'pending')
        `);
        console.log('✅ Đã thêm dữ liệu Bookings');

        console.log('🎉 Seed dữ liệu thành công!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error);
        process.exit(1);
    }
};

seedDatabase();
