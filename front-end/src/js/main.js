// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'


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
        // Send request to the API
        const response = await fetch('http://atlas.batstate-u.edu.ph:8081/login', {
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
  
        // Handle the result here
        if (result.success) {
          // Redirect or show success message
        //   window.location.href = '/dashboard'; // Example redirect
            console.log(result)
        } else {
          // Show error message
          alert('Login failed: ' + result.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  });
  