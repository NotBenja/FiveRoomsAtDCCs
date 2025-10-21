import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = Router();

/**
 * Getter routes for users
 */
router.get(`/`, getAllUsers);
router.get(`/:id`, getUserById);

/**
 * POST, PUT and DELETE routes for users
 */
router.post(`/:id`, createUser);
router.put(`/:id`, updateUser);
router.delete(`/:id`, deleteUser);

export default router;