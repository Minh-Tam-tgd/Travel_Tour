import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/my-bookings/:userId', getMyBookings);

export default router;
