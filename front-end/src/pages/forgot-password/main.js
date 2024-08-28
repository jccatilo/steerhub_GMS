import './styles.scss';
import * as bootstrap from 'bootstrap';

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const resetToast = new bootstrap.Toast(document.getElementById("resetToast"));
    
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim(); // Trim any extra whitespace

        if (email) {
            // Make the request to the backend
            fetch('http://localhost:81/request-password-reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })  // Ensure the JSON payload is correctly formatted
            })
            .then(response => {
                if (response.ok) {
                    // Show success toast
                    resetToast.show();
                    emailInput.value = ''; // Clear the input field after successful submission
                } else {
                    // Handle errors if any
                    return response.json().then(errorData => {
                        alert(`Error: ${errorData.message}`);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);  // Log the exact error
                alert('An error occurred. Please try again later.');
            });
        } else {
            alert("Please enter a valid email address."); // Alert if the email field is empty or invalid
        }
    });
});
