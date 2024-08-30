// Import our custom CSS
import './styles.scss';
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const toastElement = document.getElementById('resetToast');
    const toast = new bootstrap.Toast(toastElement);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;

        console.log('Submitting form with email:', email); // Debugging log

        try {
            const response = await fetch('http://localhost:81/research-center/request-password-reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            console.log('Response status:', response.status); // Debugging log

            if (response.ok) {
                console.log('Request successful, showing toast'); // Debugging log
                toast.show();
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData); // Debugging log
                alert(`Error: ${errorData.detail || 'Failed to send reset link.'}`);
            }
        } catch (error) {
            console.error('Network or other error:', error); // Debugging log
            alert('An error occurred while trying to send the reset link. Please try again later.');
        }
    });
});
