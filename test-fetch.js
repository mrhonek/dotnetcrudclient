// Simple test script using native fetch API instead of axios
const testRegistration = async () => {
  const timestamp = new Date().getTime();
  const apiUrl = 'https://dotnetcrud-production.up.railway.app/api/Auth/register';
  
  const requestData = {
    username: `testuser${timestamp}`,
    email: `testuser${timestamp}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
  };
  
  console.log('Testing registration with payload:', requestData);
  console.log('Sending to URL:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const responseData = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', responseData);
    
    return { success: response.ok, data: responseData };
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error };
  }
};

// Simple function to try running in browser console
window.testRegistration = testRegistration;

console.log('Test function ready: Call testRegistration() to test API'); 