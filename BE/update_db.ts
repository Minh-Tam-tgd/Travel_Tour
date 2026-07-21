import pool from './src/config/db';

async function main() {
    try {
        console.log("Thêm cột so_tien_da_tra...");
        await pool.query(`ALTER TABLE bookings ADD COLUMN so_tien_da_tra INT DEFAULT 0 AFTER tong_tien`);
    } catch (e: any) {
        if (!e.message.includes("Duplicate column name")) console.error(e);
        else console.log("Cột so_tien_da_tra đã tồn tại.");
    }
    
    try {
        console.log("Thêm cột hoan_tien_info...");
        await pool.query(`ALTER TABLE bookings ADD COLUMN hoan_tien_info TEXT AFTER trang_thai`);
    } catch (e: any) {
        if (!e.message.includes("Duplicate column name")) console.error(e);
        else console.log("Cột hoan_tien_info đã tồn tại.");
    }

    try {
        console.log("Thêm cột minh_chung_thanh_toan...");
        await pool.query(`ALTER TABLE bookings ADD COLUMN minh_chung_thanh_toan LONGTEXT AFTER hoan_tien_info`);
    } catch (e: any) {
        if (!e.message.includes("Duplicate column name")) console.error(e);
        else console.log("Cột minh_chung_thanh_toan đã tồn tại.");
    }

    console.log("Hoàn tất!");
    process.exit(0);
}

main();
