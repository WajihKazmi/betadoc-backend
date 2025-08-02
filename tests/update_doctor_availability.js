import fetch from 'node-fetch';

// API base URLs
const API_URL = 'http://localhost:5000/api';

// Doctor IDs (replace with actual IDs from your database)
const doctorIds = [
  "4d9794b8-6430-4ef6-9222-22c26d7ae6f4", // Dr. Emmanuel Okafor
  "2e169eb1-ed79-4334-a22a-5da1901b9f85", // Dr. Fatima Hassan
  "dcafdf5f-8186-4436-a05c-01db2eb6f8d5", // Dr. John Smith
  "ed078cab-1ca6-4263-8588-0a8fcacea4f5", // Dr. Michael Adebayo
  "7fdf0a01-b024-4d2e-bc0d-357dc87b2488"  // Dr. Sarah Johnson
];

// Generate a simpler availability data for a doctor
function generateDoctorAvailability(doctorId, index) {
  // Time slots for each day (8AM to 5PM with 1 hour slots)
  const timeSlots = [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "13:00", end: "14:00" }, // After lunch break
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" }
  ];
  
  // Create an availability object with simple weekday schedule
  const availability = {
    monday: { available: true, slots: timeSlots },
    tuesday: { available: true, slots: timeSlots },
    wednesday: { available: true, slots: timeSlots },
    thursday: { available: true, slots: timeSlots },
    friday: { available: true, slots: timeSlots },
    saturday: { available: index % 2 === 0, slots: timeSlots.slice(2, 6) }, // Only some doctors work Saturday with limited hours
    sunday: { available: false, slots: [] },
    timezone: "Africa/Lagos",
    slotDurationMinutes: 60
  };
  
  // Make each doctor slightly different
  if (index % 3 === 0) {
    // This doctor doesn't work on Mondays
    availability.monday.available = false;
    availability.monday.slots = [];
  }
  
  if (index % 5 === 1) {
    // This doctor doesn't work on Fridays
    availability.friday.available = false;
    availability.friday.slots = [];
  }
  
  return availability;
}

// Helper function to make API requests
async function makeRequest(url, method, data = null) {
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

// Update a doctor's availability
async function updateDoctorAvailability(doctorId, index) {
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`UPDATING DOCTOR AVAILABILITY - INDEX ${index}`);
  console.log(`=${'='.repeat(50)}`);
  
  const availability = generateDoctorAvailability(doctorId, index);
  const updateData = { availability };
  
  const result = await makeRequest(`${API_URL}/users/doctors/${doctorId}`, 'PUT', updateData);
  
  if (result.status === 200) {
    console.log(`✅ Successfully updated availability for doctor ID: ${doctorId}`);
    return true;
  } else {
    console.log(`❌ Failed to update availability for doctor ID: ${doctorId}`);
    return false;
  }
}

// Main function to update all doctors
async function updateAllDoctorsAvailability() {
  console.log('🚀 Starting Doctor Availability Update Process...\n');
  
  let successCount = 0;
  
  for (let i = 0; i < doctorIds.length; i++) {
    const success = await updateDoctorAvailability(doctorIds[i], i);
    if (success) successCount++;
  }
  
  console.log('\n🏁 Doctor availability update completed!');
  console.log(`Total doctors updated: ${successCount} out of ${doctorIds.length}`);
}

// Run the updates
updateAllDoctorsAvailability().catch(error => {
  console.error('Error updating doctor availability:', error);
});
