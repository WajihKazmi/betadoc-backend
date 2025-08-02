/**
 * Test script for consultation listing APIs
 * This tests the endpoints for fetching patient and doctor consultations
 */

// Import dependencies
import fetch from 'node-fetch';

// API URL
const API_URL = 'http://localhost:5000/api';

// Test user/patient data
const patient_id = 'b2d7c8f9-efd1-4e07-8e1a-c0e6e3f8b9a2'; // Replace with real patient ID from your DB
const doctor_id = '4d9794b8-6430-4ef6-9222-22c26d7ae6f4'; // Replace with real doctor ID from your DB
const consultation_type_id = 'c2870bda-cb4d-48c0-8156-be47310b4fa3'; // Replace with real consultation type ID

// Helper function to make HTTP requests
async function makeRequest(url, method = 'GET', body = null) {
  try {
    console.log(`🧪 Making ${method} request to ${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      console.log(`Request data: ${JSON.stringify(body, null, 2)}`);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data, null, 2)}`);
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request: ${error.message}`);
    throw error;
  }
}

// Main test function
async function testConsultationListingAPIs() {
  console.log(`\n🚀 Starting Consultation Listing APIs Test...\n`);
  
  // Test 1: Book a consultation with extended fields
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 1: BOOK CONSULTATION WITH EXTENDED FIELDS`);
  console.log(`=${'='.repeat(50)}`);
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const appointmentDate = tomorrow.toISOString().split('T')[0];
  
  const bookingData = {
    patient_id,
    doctor_id,
    consultation_type: consultation_type_id,
    appointment_date: appointmentDate,
    appointment_slot: {
      start: "10:00",
      end: "11:00"
    },
    language: "English",
    symptoms: "Headache and fever for 2 days",
    notes: "Test booking with extended fields",
    reason_for_visit: "Annual checkup",
    medical_history: "Hypertension, Diabetes",
    medications: "Metformin 500mg daily",
    allergies: "Penicillin",
    payment_status: "pending",
    payment_method: "card",
    payment_reference: "test-payment-123"
  };
  
  const bookingResult = await makeRequest(`${API_URL}/consultations/booking-with-slot`, 'POST', bookingData);
  
  if (bookingResult.status !== 201 || !bookingResult.data.success) {
    console.log(`❌ Failed to book test consultation`);
    return;
  }
  
  console.log(`✅ Successfully booked test consultation. ID: ${bookingResult.data.data.id}`);
  const consultationId = bookingResult.data.data.id;
  
  // Test 2: Get patient consultations
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 2: GET PATIENT CONSULTATIONS`);
  console.log(`=${'='.repeat(50)}`);
  
  const patientConsultationsResult = await makeRequest(`${API_URL}/consultations/patient/${patient_id}`);
  
  if (patientConsultationsResult.status !== 200 || !patientConsultationsResult.data.success) {
    console.log(`❌ Failed to get patient consultations`);
  } else {
    const { upcoming, past, cancelled } = patientConsultationsResult.data.data;
    console.log(`✅ Successfully fetched patient consultations`);
    console.log(`  - Upcoming: ${upcoming.length}`);
    console.log(`  - Past: ${past.length}`);
    console.log(`  - Cancelled: ${cancelled.length}`);
    console.log(`  - Total: ${patientConsultationsResult.data.count.total}`);
  }
  
  // Test 3: Get doctor consultations
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 3: GET DOCTOR CONSULTATIONS`);
  console.log(`=${'='.repeat(50)}`);
  
  const doctorConsultationsResult = await makeRequest(`${API_URL}/consultations/doctor/${doctor_id}`);
  
  if (doctorConsultationsResult.status !== 200 || !doctorConsultationsResult.data.success) {
    console.log(`❌ Failed to get doctor consultations`);
  } else {
    const { today, upcoming, past, cancelled } = doctorConsultationsResult.data.data;
    console.log(`✅ Successfully fetched doctor consultations`);
    console.log(`  - Today: ${today.length}`);
    console.log(`  - Upcoming: ${upcoming.length}`);
    console.log(`  - Past: ${past.length}`);
    console.log(`  - Cancelled: ${cancelled.length}`);
    console.log(`  - Total: ${doctorConsultationsResult.data.count.total}`);
  }
  
  // Test 4: Get consultations with status filter
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 4: GET CONSULTATIONS WITH STATUS FILTER`);
  console.log(`=${'='.repeat(50)}`);
  
  const statusFilterResult = await makeRequest(`${API_URL}/consultations/patient/${patient_id}?status=pending`);
  
  if (statusFilterResult.status !== 200 || !statusFilterResult.data.success) {
    console.log(`❌ Failed to get consultations with status filter`);
  } else {
    console.log(`✅ Successfully fetched consultations with status filter`);
    console.log(`  - Total pending consultations: ${statusFilterResult.data.count.total}`);
  }
  
  // Test 5: Update consultation status
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 5: UPDATE CONSULTATION STATUS`);
  console.log(`=${'='.repeat(50)}`);
  
  if (consultationId && !consultationId.includes('mock')) {
    const updateData = {
      status: 'confirmed',
      diagnosis: 'Initial diagnosis: possible viral infection',
      notes: 'Patient should rest and stay hydrated'
    };
    
    const updateResult = await makeRequest(
      `${API_URL}/consultations/${consultationId}/status`, 
      'PUT', 
      updateData
    );
    
    if (updateResult.status !== 200 || !updateResult.data.success) {
      console.log(`❌ Failed to update consultation status`);
    } else {
      console.log(`✅ Successfully updated consultation status to 'confirmed'`);
      console.log(`  - Updated consultation ID: ${updateResult.data.data.id}`);
      console.log(`  - New status: ${updateResult.data.data.status}`);
    }
  } else {
    console.log(`ℹ️ Skipping status update test because we have a mock consultation ID`);
  }
  
  console.log('\n🏁 Consultation Listing APIs Test completed!');
}

// Run the test
testConsultationListingAPIs().catch(error => {
  console.error('Error running tests:', error);
});
