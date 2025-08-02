// controllers/consultationController.js
import { consultationModel } from '../models/consultation_model.js';
import { doctorModel } from '../models/doctor_model.js';
import {
  bookConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  updateConsultationStatus
} from './consultation_booking.js';

// Re-export booking controller functions
export {
  bookConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  updateConsultationStatus
};

/**
 * Create a new consultation type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createConsultationType = async (req, res) => {
  try {
    const { name, fee, doctor_earning, platform_fee, is_specialist, is_follow_up, description } = req.body;

    // Validate if required fields are provided
    if (!name || !fee || !doctor_earning || !platform_fee || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Insert new consultation type into the database
    const newConsultationType = await consultationModel.createConsultationType({
      name,
      fee,
      doctor_earning,
      platform_fee,
      is_specialist,
      is_follow_up,
      description
    });

    return res.status(201).json({
      success: true,
      message: 'Consultation type added successfully',
      data: newConsultationType
    });
  } catch (error) {
    console.error('Error creating consultation type:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all consultation types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConsultationTypes = async (req, res) => {
  try {
    const consultationTypes = await consultationModel.getConsultationTypes();
    
    return res.status(200).json({
      success: true,
      message: 'Consultation types fetched successfully',
      data: consultationTypes
    });
  } catch (error) {
    console.error('Error fetching consultation types:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get available doctors for a specific consultation type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAvailableDoctors = async (req, res) => {
  try {
    const { 
      type_id, 
      language, 
      mode, 
      gender, 
      min_experience, 
      location 
    } = req.query;
    
    // Validate required parameters
    if (!type_id) {
      return res.status(400).json({
        success: false,
        message: 'Consultation type ID is required'
      });
    }
    
    // Get available doctors
    const doctors = await doctorModel.getAvailableDoctorsForConsultationType(
      type_id,
      {
        language,
        mode,
        gender,
        min_experience,
        location
      }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Available doctors fetched successfully',
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get available time slots for a doctor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDoctorAvailableSlots = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { date, consultation_type_id } = req.query;
    
    // Validate required parameters
    if (!doctor_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD'
      });
    }
    
    // Get available slots
    const slots = await doctorModel.getDoctorAvailableSlots(doctor_id, date, consultation_type_id);
    
    return res.status(200).json({
      success: true,
      message: 'Available slots fetched successfully',
      data: slots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Book a consultation with a specific slot
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const bookConsultationWithSlot = async (req, res) => {
  try {
    const {
      doctor_id,
      consultation_type_id,
      slot_id,
      notes,
      symptoms,
      medical_history,
      current_medications,
      allergies
    } = req.body;
    
    // Get patient_id from authenticated user
    const patient_id = req.user.id;
    
    // Validate required fields
    if (!doctor_id || !consultation_type_id || !slot_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: doctor_id, consultation_type_id, and slot_id are required'
      });
    }
    
    // Book the consultation
    const consultation = await consultationModel.bookConsultationWithSlot({
      patient_id,
      doctor_id,
      consultation_type_id,
      slot_id,
      notes,
      symptoms,
      medical_history,
      current_medications,
      allergies
    });
    
    return res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Error booking consultation with slot:', error);
    
    // Handle specific errors with appropriate status codes
    if (error.message.includes('not available')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
