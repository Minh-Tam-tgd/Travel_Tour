import { Router } from 'express';
import { handleChat } from '../controllers/chatbot.controller';

const router = Router();

// Định nghĩa API endpoint cho khung chat widget gọi vào
router.post('/chat', handleChat);

export default router;
