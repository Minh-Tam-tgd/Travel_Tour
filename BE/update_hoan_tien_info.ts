import pool from './src/config/db';

async function main() {
    try {
        console.log("Cập nhật cột hoan_tien_info thành LONGTEXT...");
        await pool.query(`ALTER TABLE bookings MODIFY COLUMN hoan_tien_info LONGTEXT;`);
        console.log("Cập nhật thành công!");
    } catch (e: any) {
        console.error("Lỗi:", e.message);
    }
    process.exit(0);
}

main();
