import './styles.scss';
import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const organization = document.getElementById('organization').value;
        const password = document.getElementById('password').value;

        // Prepare data for API request
        const data = {
            username: name,
            email: email,
            institution_name: organization,
            password: password
        };

        try {
            // Send request to the API
            const response = await fetch('http://localhost:81/users', {  // Replace with your API endpoint
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

            console.log(response.status)

            if (response.status == 200) {

                console.log("signup successful")

                // Show the toast notification
                const toastElement = document.getElementById('signupToast');
                // console.log(toastElement)
                const toast = new bootstrap.Toast(toastElement);
                toast.show();

                // Redirect after a delay to show the toast
                setTimeout(() => {
                    window.location.href = '/'; // Redirect to the homepage or login page
                }, 3000);
            } else {
                // Handle signup failure
                alert('Signup failed: ' + result.message);

            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
