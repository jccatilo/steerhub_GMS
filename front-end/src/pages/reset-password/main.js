import './styles.scss';
import * as bootstrap from 'bootstrap';
import { CONFIG } from '../../gms_config.js';  // Import the configuration from gms_config.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('resetPasswordForm');
    const message = document.getElementById('message');
    
    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        message.textContent = "Invalid or missing token.";
        return;
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        
        try {
            // Construct the API URL using the configuration
            const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/users/reset-password`;
            console.log('API URL:', apiUrl);  // Debugging log

            // Send the new password to the backend
            const response = await fetch(apiUrl, {
                method: 'PUT',  // Use PUT method
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,             // Send token in the body
                    new_password: newPassword // Send new_password in the body
                })
            });

            if (response.ok) {
                message.textContent = "Password successfully changed!";
                setTimeout(() => {
                    window.location.href = 'http://atlas.batstate-u.edu.ph/steerhub_guest_management/'; // Redirect to the login page
                }, 3000); // Redirect after 3 seconds
            } else {
                const errorData = await response.json();
                message.textContent = `Error: ${errorData.detail}`;
            }
        } catch (error) {
            message.textContent = `An error occurred: ${error.message}`;
        }
    });
});
