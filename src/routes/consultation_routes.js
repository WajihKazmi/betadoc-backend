import express from 'express';
import { createConsultationType, getConsultationTypes } from '../controllers/consultation_controller.js';

const router = express.Router();

// POST - Create a new consultation type
router.post('/consultation-type', createConsultationType);

// GET - Get all available consultation types
router.get('/consultation-types', getConsultationTypes);

export default router;
