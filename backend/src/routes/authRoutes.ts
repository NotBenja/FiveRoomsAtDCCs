import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * Authentication routes
 */
router.post(`/register`, register);
router.post(`/login`, login);
router.post(`/logout`, logout);

/**
 * Protected route to get current user info
 */
router.get(`/me`, authMiddleware, me);

export default router;