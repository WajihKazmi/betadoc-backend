// controllers/user.controller.js
import { userModel } from '../models/user.model.js';

/**
 * Get all doctors with optional filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllDoctors = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { specialty, location, consultation_mode, gender, is_active } = req.query;
    
    // Create filters object
    const filters = {};
    
    if (specialty) filters.specialty = specialty;
    if (location) filters.location = location;
    if (consultation_mode) filters.consultation_mode = consultation_mode;
    if (gender) filters.gender = gender;
    if (is_active !== undefined) {
      // Convert string to boolean
      filters.is_active = is_active === 'true';
    }
    
    // Get doctors with filters
    const doctors = await userModel.getAllDoctors(filters);
    
    // Return response
    return res.status(200).json({
      success: true,
      message: 'Doctors fetched successfully',
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all patients with optional filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPatients = async (req, res) => {
  try {
    // Extract filter parameters from query
    const { language, referral_source } = req.query;
    
    // Create filters object
    const filters = {};
    
    if (language) filters.language = language;
    if (referral_source) filters.referral_source = referral_source;
    
    // Get patients with filters
    const patients = await userModel.getAllPatients(filters);
    
    // Return response
    return res.status(200).json({
      success: true,
      message: 'Patients fetched successfully',
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update doctor profile including availability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate doctor ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }
    
    // Check if doctor exists
    const existingDoctor = await userModel.getDoctorById(id);
    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Don't allow password updates through this endpoint
    if (updateData.password) {
      delete updateData.password;
    }
    
    // Update doctor
    const updatedDoctor = await userModel.updateDoctor(id, updateData);
    
    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update patient profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate patient ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }
    
    // Check if patient exists
    const existingPatient = await userModel.getPatientById(id);
    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Don't allow password updates through this endpoint
    if (updateData.password) {
      delete updateData.password;
    }
    
    // Update patient
    const updatedPatient = await userModel.updatePatient(id, updateData);
    
    return res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
