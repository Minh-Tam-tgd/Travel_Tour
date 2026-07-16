import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking, refundBooking } from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/my-bookings/:userId', getMyBookings);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/refund', refundBooking);

export default router;
