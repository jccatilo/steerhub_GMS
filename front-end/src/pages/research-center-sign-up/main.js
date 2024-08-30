import './styles.scss';
import { CONFIG } from '../../gms_config.js';  // Import the configuration from gms_config.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const maxGuestCapacity = document.getElementById('max_guest_capacity').value;

        const requestData = {
            email: email,
            password: password,
            max_guest_capacity: maxGuestCapacity
        };

        try {
            // Construct the API URL using the configuration
            const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/research-center/signup/`;
            console.log('API URL:', apiUrl);  // Debugging log

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);

                // Show the success toast
                showToast('Success', 'Signup successful! Redirecting to login...');

                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = '../../research-center-login/index.html';
                }, 2000);
            } else {
                const errorData = await response.json();
                showToast('Error', errorData.detail || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error', 'An error occurred during sign-up. Please try again.');
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
