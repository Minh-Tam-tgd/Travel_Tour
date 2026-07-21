import pool from './src/config/db';

async function main() {
    try {
        console.log("Adding thu_vien_anh to tours...");
        await pool.query(`ALTER TABLE tours ADD COLUMN thu_vien_anh LONGTEXT NULL;`);
    } catch (e: any) {
        console.log("tours error:", e.message);
    }
    
    try {
        console.log("Adding thu_vien_anh to restaurants...");
        await pool.query(`ALTER TABLE restaurants ADD COLUMN thu_vien_anh LONGTEXT NULL;`);
    } catch (e: any) {
        console.log("restaurants error:", e.message);
    }
    
    console.log("Done!");
    process.exit(0);
}

main();
