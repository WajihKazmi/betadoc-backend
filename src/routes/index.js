import express from 'express';
import authRoutes from './auth.routes.js';
import consultationRoutes from './consultation_routes.js';

const router = express.Router();

// Use the specific route files
router.use('/auth', authRoutes); // All authentication routes
router.use('/consultations', consultationRoutes); // All consultation-related routes

export default router;