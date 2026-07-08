import { Router } from 'express';
import tourRoutes from './tour.routes';
import restaurantRoutes from './restaurant.routes';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/tour', tourRoutes);
router.use('/nha-hang', restaurantRoutes);
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);

export default router;
