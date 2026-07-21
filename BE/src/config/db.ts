import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travel_tour_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connect to MySQL successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Connect to MySQL failed:', error);
        process.exit(1);
    }
};

export default pool;
