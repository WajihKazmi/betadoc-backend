import fetch from 'node-fetch';

// API base URLs
const API_URL = 'http://localhost:5000/api';

// Helper function to make API requests
async function makeRequest(url, method = 'GET') {
  try {
    console.log(`\n🧪 Making ${method} request to ${url}`);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response data count:', result.data ? result.data.length : 0);
    
    // Only print first 3 items to avoid cluttering the console
    if (result.data && result.data.length > 0) {
      console.log('First few items:', JSON.stringify(result.data.slice(0, 3), null, 2));
      
      if (result.data.length > 3) {
        console.log(`...and ${result.data.length - 3} more items`);
      }
    } else {
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error making request to ${url}:`, error.message);
    return { error: error.message };
  }
}

// Test runner for fetching registered users
async function testUserEndpoints() {
  console.log('🚀 Starting User API Tests...\n');
  
  // Test 1: Get all doctors
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 1: GET ALL DOCTORS`);
  console.log(`=${'='.repeat(50)}`);
  
  const doctorsResult = await makeRequest(`${API_URL}/users/doctors`);
  
  if (doctorsResult.status === 200) {
    console.log(`✅ Successfully retrieved all doctors. Total count: ${doctorsResult.data.count || 0}`);
  } else {
    console.log(`❌ Failed to retrieve doctors`);
  }
  
  // Test 2: Get doctors with filters
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 2: GET DOCTORS WITH FILTERS (Specialty = 'General Consultation')`);
  console.log(`=${'='.repeat(50)}`);
  
  const filteredDoctorsResult = await makeRequest(`${API_URL}/users/doctors?specialty=General%20Consultation`);
  
  if (filteredDoctorsResult.status === 200) {
    console.log(`✅ Successfully retrieved filtered doctors. Total count: ${filteredDoctorsResult.data.count || 0}`);
  } else {
    console.log(`❌ Failed to retrieve filtered doctors`);
  }
  
  // Test 3: Get doctors with multiple filters
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 3: GET DOCTORS WITH MULTIPLE FILTERS (Gender = 'female' AND is_active = true)`);
  console.log(`=${'='.repeat(50)}`);
  
  const multiFilterDoctorsResult = await makeRequest(`${API_URL}/users/doctors?gender=female&is_active=true`);
  
  if (multiFilterDoctorsResult.status === 200) {
    console.log(`✅ Successfully retrieved multi-filtered doctors. Total count: ${multiFilterDoctorsResult.data.count || 0}`);
  } else {
    console.log(`❌ Failed to retrieve multi-filtered doctors`);
  }
  
  // Test 4: Get all patients
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 4: GET ALL PATIENTS`);
  console.log(`=${'='.repeat(50)}`);
  
  const patientsResult = await makeRequest(`${API_URL}/users/patients`);
  
  if (patientsResult.status === 200) {
    console.log(`✅ Successfully retrieved all patients. Total count: ${patientsResult.data.count || 0}`);
  } else {
    console.log(`❌ Failed to retrieve patients`);
  }
  
  // Test 5: Get patients with filters
  console.log(`\n=${'='.repeat(50)}`);
  console.log(`TEST 5: GET PATIENTS WITH FILTERS (Language = 'English')`);
  console.log(`=${'='.repeat(50)}`);
  
  const filteredPatientsResult = await makeRequest(`${API_URL}/users/patients?language=English`);
  
  if (filteredPatientsResult.status === 200) {
    console.log(`✅ Successfully retrieved filtered patients. Total count: ${filteredPatientsResult.data.count || 0}`);
  } else {
    console.log(`❌ Failed to retrieve filtered patients`);
  }
  
  console.log('\n🏁 User API tests completed!');
}

// Run the test
testUserEndpoints().catch(error => {
  console.error('Error running tests:', error);
});
