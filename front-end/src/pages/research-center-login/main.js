// Import our custom CSS
import './styles.scss';
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Alert from 'bootstrap/js/dist/alert';

// Or, specify which plugins you need:
import { Tooltip, Toast, Popover } from 'bootstrap';

import { CONFIG } from '../../gms_config.js';  // Adjust the path according to your project structure

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    console.log('myform:', form);
    form.addEventListener('submit', async (event) => {
        console.log('myfor111m:', form);
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const requestData = {
            email: email,
            password: password
        };

        // Log the request data to verify the payload
        console.log('Sending request to API:', requestData);

        try {
            // Construct the API URL using the configuration
            const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/research-center/login/`;
            console.log('API URL:', apiUrl);  // Debugging log

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // Log the entire response object for further inspection
            console.log('Response received:', response);

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);

                // Store the access_token, center_id, and email in localStorage
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('center_id', result.center_id);
                localStorage.setItem('email', result.email);

                // Show a success toast
                showToast('Success', 'Login successful! Redirecting...');

                // Redirect to the dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '../../pages/research-center-dashboard/index.html';
                }, 2000);
            } else {
                const errorData = await response.json();
                // Log the error details sent by the server
                console.log('Error response:', errorData);
                showToast('Error', errorData.detail || 'Login failed. Please try again.');
            }
        } catch (error) {
            // Log any network errors that occur
            console.error('Network error:', error);
            showToast('Error', 'An error occurred during login. Please try again.');
        }
    });

    function showToast(title, message) {
        const toastContainer = document.querySelector('.toast-container');

        // Create toast element
        const toastElement = document.createElement('div');
        toastElement.classList.add('toast', 'show');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        // Toast header
        const toastHeader = document.createElement('div');
        toastHeader.classList.add('toast-header');
        toastHeader.innerHTML = `
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        `;
        toastElement.appendChild(toastHeader);

        // Toast body
        const toastBody = document.createElement('div');
        toastBody.classList.add('toast-body');
        toastBody.textContent = message;
        toastElement.appendChild(toastBody);

        // Append to toast container
        toastContainer.appendChild(toastElement);

        // Automatically remove the toast after it fades out
        setTimeout(() => {
            toastElement.classList.remove('show');
            setTimeout(() => toastElement.remove(), 500); // Wait for fade out transition
        }, 3000); // Show for 3 seconds
    }
});
