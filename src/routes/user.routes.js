import express from 'express';
import { 
  getAllDoctors, 
  getAllPatients, 
  updateDoctor, 
  updatePatient 
} from '../controllers/user.controller.js';
import { protect, doctorOnly, patientOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all doctors (with optional filtering)
router.get('/doctors', getAllDoctors);

// Get all patients (doctor only)
router.get('/patients', protect, doctorOnly, getAllPatients);

// Update doctor profile (doctor only)
router.put('/doctors/:id', protect, doctorOnly, updateDoctor);

// Update patient profile (patient only)
router.put('/patients/:id', protect, patientOnly, updatePatient);

export default router;
