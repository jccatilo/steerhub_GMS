import './styles.scss';
import * as bootstrap from 'bootstrap';
import { CONFIG } from '../../gms_config.js';  // Ensure the path is correct relative to your project structure

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');  // Extract the token from the URL
    const form = document.getElementById('resetForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = document.getElementById('password').value;

        // Construct the API URL dynamically using the configuration
        const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/research-center/reset-password/`;
        console.log('API URL:', apiUrl);  // Debugging the constructed URL

        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',  // Use PUT method
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token, new_password: password })  // Send token and new password
            });

            if (response.ok) {
                alert('Password reset successful!');
                window.location.href = '../../pages/research-center-login/index.html';  // Redirect to login page
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
