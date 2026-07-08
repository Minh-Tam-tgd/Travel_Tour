import { Router } from 'express';
import { getAllRestaurants } from '../controllers/restaurant.controller';

const router = Router();

router.get('/', getAllRestaurants);

export default router;
