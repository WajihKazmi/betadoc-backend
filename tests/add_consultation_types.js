import fetch from 'node-fetch';

// API base URL
const CONSULTATION_URL = 'http://localhost:5000/api/consultations';

// Test data for consultation types
const consultationTypes = [
  {
    name: 'General Consultation',
    fee: 1000,
    doctor_earning: 700,
    platform_fee: 300,
    is_specialist: false,
    is_follow_up: false,
    description: 'A general medical consultation for common health issues and concerns.'
  },
  {
    name: 'Specialist Consultation',
    fee: 2500,
    doctor_earning: 1800,
    platform_fee: 700,
    is_specialist: true,
    is_follow_up: false,
    description: 'A consultation with a specialist doctor for specific medical conditions.'
  },
  {
    name: 'Total Health Check',
    fee: 3500,
    doctor_earning: 2500,
    platform_fee: 1000,
    is_specialist: true,
    is_follow_up: false,
    description: 'A comprehensive health assessment including general wellness evaluation.'
  },
  {
    name: 'Follow-up Consultation',
    fee: 500,
    doctor_earning: 350,
    platform_fee: 150,
    is_specialist: false,
    is_follow_up: true,
    description: 'A follow-up appointment to review progress after an initial consultation.'
  }
];

// Helper function to make API requests
async function makeRequest(url, method, data) {
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

// Test runner for adding consultation types
async function addConsultationTypes() {
  console.log('🚀 Starting Consultation Types Creation Process...\n');
  
  const typeIds = [];
  
  for (let i = 0; i < consultationTypes.length; i++) {
    const type = consultationTypes[i];
    
    console.log(`\n=${'='.repeat(50)}`);
    console.log(`CREATING CONSULTATION TYPE ${i+1}: ${type.name}`);
    console.log(`=${'='.repeat(50)}`);
    
    const createResult = await makeRequest(`${CONSULTATION_URL}/consultation-type`, 'POST', type);
    
    if (createResult.status === 201 || createResult.status === 200) {
      if (createResult.data.data && createResult.data.data.id) {
        typeIds.push(createResult.data.data.id);
        console.log(`✅ Successfully created consultation type: ${type.name} (ID: ${createResult.data.data.id})`);
      }
    } else {
      console.log(`❌ Failed to create consultation type: ${type.name}`);
    }
  }
  
  console.log('\n🏁 Consultation types creation completed!');
  console.log(`Total types created: ${typeIds.length} out of ${consultationTypes.length}`);
  console.log('Created type IDs:', typeIds);
  
  // Fetch all consultation types to verify
  console.log('\n📋 FETCHING ALL CONSULTATION TYPES');
  const getTypesResult = await makeRequest(`${CONSULTATION_URL}/consultation-types`, 'GET');
  
  if (getTypesResult.status === 200) {
    console.log(`✅ Successfully fetched all consultation types. Total: ${getTypesResult.data.data?.length || 0}`);
  } else {
    console.log(`❌ Failed to fetch consultation types`);
  }
}

// Run the test
addConsultationTypes().catch(error => {
  console.error('Error running tests:', error);
});
