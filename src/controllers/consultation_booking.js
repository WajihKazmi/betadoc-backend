import { consultationModel } from '../models/consultation_model.js';

/**
 * Book a new consultation
 * Creates a consultation record linking patient, doctor and consultation type
 */
export const bookConsultation = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      consultation_type,
      language,
      symptoms
    } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !consultation_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patient_id, doctor_id, and consultation_type are required'
      });
    }

    // Create the consultation
    const consultation = await consultationModel.createConsultation({
      patient_id,
      doctor_id,
      consultation_type,
      language,
      symptoms,
      status: 'pending' // Initial status
    });

    return res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Error booking consultation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to book consultation',
      error: error.message
    });
  }
};

/**
 * Get consultations for a patient
 */
export const getPatientConsultations = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { status } = req.query;
    
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }
    
    const consultations = await consultationModel.getPatientConsultations(patient_id, status);
    
    return res.status(200).json({
      success: true,
      message: 'Patient consultations fetched successfully',
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching patient consultations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patient consultations',
      error: error.message
    });
  }
};

/**
 * Get consultations for a doctor
 */
export const getDoctorConsultations = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status } = req.query;
    
    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }
    
    const consultations = await consultationModel.getDoctorConsultations(doctor_id, status);
    
    return res.status(200).json({
      success: true,
      message: 'Doctor consultations fetched successfully',
      count: consultations.length,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching doctor consultations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor consultations',
      error: error.message
    });
  }
};

/**
 * Update a consultation's status
 */
export const updateConsultationStatus = async (req, res) => {
  try {
    const { consultation_id } = req.params;
    const { status, ...additionalData } = req.body;
    
    if (!consultation_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Consultation ID and status are required'
      });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updatedConsultation = await consultationModel.updateConsultationStatus(
      consultation_id,
      status,
      additionalData
    );
    
    return res.status(200).json({
      success: true,
      message: `Consultation status updated to ${status}`,
      data: updatedConsultation
    });
  } catch (error) {
    console.error('Error updating consultation status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update consultation status',
      error: error.message
    });
  }
};
