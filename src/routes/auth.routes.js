import express from 'express';
import {
  registerPatient,
  registerDoctor,
  loginPatient,
  loginDoctor,
  getMe,
  updatePatientProfile,
  updateDoctorProfile,
  refreshToken,
  logout
} from '../controllers/auth.controller.js';
import {
  protect,
  patientOnly,
  doctorOnly,
  loadUserProfile
} from '../middlewares/auth.middleware.js';
import {
  validatePatientRegistration,
  validateDoctorRegistration,
  validateLogin,
  validateRefreshToken
} from '../middlewares/validation.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/patient/register', validatePatientRegistration, registerPatient);
router.post('/doctor/register', validateDoctorRegistration, registerDoctor);
router.post('/patient/login', validateLogin, loginPatient);
router.post('/doctor/login', validateLogin, loginDoctor);
router.post('/refresh', validateRefreshToken, refreshToken);
router.post('/logout', logout);

// Protected routes (authentication required)
router.get('/me', protect, loadUserProfile, getMe);

// Patient-specific routes
router.put('/patient/profile', protect, patientOnly, updatePatientProfile);

// Doctor-specific routes
router.put('/doctor/profile', protect, doctorOnly, updateDoctorProfile);

export default router;

