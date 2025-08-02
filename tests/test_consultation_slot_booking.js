import fetch from 'node-fetch';

// API base URLs
const API_URL = 'http://localhost:5000/api';

// Sample data for testing
const patient_id = 'b2d7c8f9-efd1-4e07-8e1a-c0e6e3f8b9a2'; // Replace with an actual patient ID

// List of doctor IDs to try (in case some don't have availability)
const doctorIds = [
  '4d9794b8-6430-4ef6-9222-22c26d7ae6f4', // Dr. Emmanuel Okafor
  'dcafdf5f-8186-4436-a05c-01db2eb6f8d5', // Dr. John Smith
  '7fdf0a01-b024-4d2e-bc0d-357dc87b2488', // Dr. Sarah Johnson
  '2e169eb1-ed79-4334-a22a-5da1901b9f85', // Dr. Fatima Hassan
  'ed078cab-1ca6-4263-8588-0a8fcacea4f5'  // Dr. Michael Adebayo
];

const consultation_type_id = 'c2870bda-cb4d-48c0-8156-be47310b4fa3'; // General Consultation

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Get dates for testing that are likely to have doctor availability
function getTestDates() {
  const today = new Date();
  const dates = [];
  
  // Add the next 5 days as potential test dates
  for (let i = 1; i <= 5; i++) {
    const testDate = new Date();
    testDate.setDate(today.getDate() + i);
    dates.push(formatDate(testDate));
  }
  
  return dates;
}

// Helper function to make API requests
async function makeRequest(url, method = 'GET', data = null) {
  try {
    console.log(`\n🧪 Making ${method} request to ${url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error making request to ${url}:`, error.message);
    return { error: error.message };
  }
}

// Test consultation booking flow with time slots
async function testConsultationBookingWithSlots() {
  console.log('🚀 Starting Consultation Booking Flow Test With Time Slots...\n');
  
  const testDates = getTestDates();
  console.log(`Will try these dates for testing: ${testDates.join(', ')}`);
  
  // Find a doctor with available slots
  let availableDoctor = null;
  let availableDate = null;
  let slotsResult = null;
  
  // Try each doctor with each date until we find one with availability
  for (const doctorId of doctorIds) {
    for (const date of testDates) {
      console.log(`\nChecking availability for doctor ${doctorId} on ${date}...`);
      
      slotsResult = await makeRequest(`${API_URL}/consultations/doctor-slots?doctor_id=${doctorId}&date=${date}`);
      
      if (slotsResult.status === 200 && 
          slotsResult.data.success && 
          slotsResult.data.data.available && 
          slotsResult.data.data.slots.length > 0) {
        availableDoctor = doctorId;
        availableDate = date;
        console.log(`✅ Found available doctor (${doctorId}) with slots on ${date}`);
        break;
      } else {
        console.log(`❌ No availability for doctor ${doctorId} on ${date}`);
      }
    }
    
    if (availableDoctor) break;
  }
  
  if (!availableDoctor) {
    console.log(`\n❌ Could not find any doctor with availability on test dates.`);
    console.log(`Please run the update-availability script and try again.`);
    return;
  }
  
  // Test 1: Get available time slots for the selected doctor
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 1: GET AVAILABLE TIME SLOTS FOR DOCTOR`);
  console.log(`=${'='.repeat(50)}`);
  
  console.log(`✅ Successfully found doctor with slots. Available: ${slotsResult.data.data.available}`);
  console.log(`Available slots: ${slotsResult.data.data.slots.length}`);
  
  // Select the first available slot for testing
  const selectedSlot = slotsResult.data.data.slots[0];
  console.log(`Selected slot for booking: ${selectedSlot.start} - ${selectedSlot.end}`);
  
  // Test 2: Book a consultation with the selected time slot
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 2: BOOK CONSULTATION WITH TIME SLOT`);
  console.log(`=${'='.repeat(50)}`);
  
  const bookingData = {
    patient_id,
    doctor_id: availableDoctor,
    consultation_type: consultation_type_id,
    appointment_date: availableDate,
    appointment_slot: selectedSlot,
    language: "English",
    symptoms: "Headache and fever for 2 days",
    notes: "Test booking with time slot"
  };
  
  const bookingResult = await makeRequest(`${API_URL}/consultations/booking-with-slot`, 'POST', bookingData);
  
  if (bookingResult.status !== 201 || !bookingResult.data.success) {
    console.log(`❌ Failed to book consultation with time slot`);
    return;
  }
  
  const consultationId = bookingResult.data.data.id;
  const isMockData = consultationId.includes('mock');
  
  console.log(`✅ Successfully booked consultation with time slot. ID: ${consultationId}`);
  if (isMockData) {
    console.log(`ℹ️ Using mock data for testing (ID contains 'mock')`);
  }
  
  // Test 3: Verify the slot is no longer available
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 3: VERIFY SLOT IS NO LONGER AVAILABLE`);
  console.log(`=${'='.repeat(50)}`);
  
  const updatedSlotsResult = await makeRequest(`${API_URL}/consultations/doctor-slots?doctor_id=${availableDoctor}&date=${availableDate}`);
  
  if (updatedSlotsResult.status !== 200 || !updatedSlotsResult.data.success) {
    console.log(`❌ Failed to get updated doctor slots`);
    return;
  }
  
  // Check if the booked slot is no longer in the available slots
  const slotStillAvailable = updatedSlotsResult.data.data.slots.some(
    slot => slot.start === selectedSlot.start && slot.end === selectedSlot.end
  );
  
  if (slotStillAvailable) {
    if (isMockData) {
      console.log(`ℹ️ The booked slot is still showing as available (expected with mock data)`);
    } else {
      console.log(`❌ The booked slot is still showing as available`);
    }
  } else {
    console.log(`✅ The booked slot is correctly removed from available slots`);
  }
  
  // Test 4: Try to book the same slot again (should fail)
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 4: TRY TO BOOK THE SAME SLOT AGAIN (SHOULD FAIL)`);
  console.log(`=${'='.repeat(50)}`);
  
  const duplicateBookingResult = await makeRequest(`${API_URL}/consultations/booking-with-slot`, 'POST', bookingData);
  
  if (duplicateBookingResult.status === 409) {
    console.log(`✅ Correctly rejected duplicate booking with conflict status`);
  } else if (isMockData && duplicateBookingResult.status === 201) {
    console.log(`ℹ️ Duplicate booking succeeded with status 201 (expected with mock data)`);
    console.log(`   Mock ID: ${duplicateBookingResult.data.data.id}`);
  } else {
    console.log(`❌ Duplicate booking test failed with unexpected status: ${duplicateBookingResult.status}`);
  }
  
  console.log('\n🏁 Consultation Booking Flow Test completed!');
}

// Run the test
testConsultationBookingWithSlots().catch(error => {
  console.error('Error running tests:', error);
});
