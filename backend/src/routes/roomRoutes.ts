import { Router } from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController';

const router = Router();

/**
 * Getter routes for rooms
 */
router.get(`/`, getAllRooms);
router.get(`/:id`, getRoomById);

/**
 * POST, PUT and DELETE routes for rooms
 */
router.post(`/`, createRoom);
router.put(`/:id`, updateRoom);
router.delete(`/:id`, deleteRoom);

export default router;

