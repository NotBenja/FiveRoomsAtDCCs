import { Router } from 'express';
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController';

const router = Router();

/**
 * Getter routes for reservations
 */
router.get(`/`, getAllReservations);
router.get(`/:id`, getReservationById);

/**
 * POST, PUT and DELETE routes for reservations
 */
router.post(`/`, createReservation);
router.put(`/:id`, updateReservation);
router.delete(`/:id`, deleteReservation);

export default router;

