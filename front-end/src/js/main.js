// import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'
import { CONFIG } from '../gms_config.js';  // Adjust the path to correctly import the configuration

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare data for API request
    const data = {
      email: email,
      password: password
    };

    try {
      // Construct the API URL using the configuration
      const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/login`;
      console.log('API URL:', apiUrl);  // Debugging log

      // Send request to the API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      console.log(result);

      // Handle the result here
      if (result !== null) {
        // Store the token or a flag in localStorage or sessionStorage
        localStorage.setItem('authToken', result.access_token); // Store the token
        localStorage.setItem('email', result.email); // Store the email
        localStorage.setItem('username', result.username); // Store the username
        localStorage.setItem('isAuthenticated', true); // Or store an auth flag
        console.log("Login successful");

        // Redirect to the user dashboard
        window.location.href = '/pages/user/index.html'; // Example redirect
      } else {
        // Show error message
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});
