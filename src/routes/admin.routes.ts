import { Router } from 'express';
import { 
    getTours, createTour, updateTour, deleteTour, toggleTourActive,
    getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, toggleRestaurantActive,
    getBookings, updateBookingStatus 
} from '../controllers/admin.controller';

const router = Router();

// Tours
router.get('/tour', getTours);
router.post('/tour', createTour);
router.put('/tour/:id', updateTour);
router.delete('/tour/:id', deleteTour);
router.put('/tour/:id/active', toggleTourActive);

// Restaurants
router.get('/restaurant', getRestaurants);
router.post('/restaurant', createRestaurant);
router.put('/restaurant/:id', updateRestaurant);
router.delete('/restaurant/:id', deleteRestaurant);
router.put('/restaurant/:id/active', toggleRestaurantActive);

// Bookings
router.get('/booking', getBookings);
router.put('/booking/:id/status', updateBookingStatus);

export default router;
