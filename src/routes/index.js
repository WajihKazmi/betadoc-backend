import express from 'express';
import authRoutes from './auth.routes.js';
import consultationRoutes from './consultation_routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

// Use the specific route files
router.use('/auth', authRoutes); // All authentication routes
router.use('/consultations', consultationRoutes); // All consultation-related routes
router.use('/users', userRoutes); // All user-related routes (doctors and patients)

export default router;