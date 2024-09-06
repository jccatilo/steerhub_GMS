// Import our custom CSS
import './styles.scss';
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';
import { CONFIG } from '../../gms_config.js';  // Adjust the path according to your project structure

let currentRequestId = null; // Make currentRequestId globally accessible

document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('email'); // Assuming the email is stored in localStorage after login

    if (!email) {
        console.error('No email found in localStorage');
        return;
    }

    // Generate greeting message
    const name = email.split('@')[0].toUpperCase(); // Get text before @ and convert to uppercase
    document.getElementById('greeting').textContent = `Hi, ${name} admin`;

    // Set up event listeners for each button
    document.getElementById('pending-btn').addEventListener('click', () => fetchRequests(email, 'pending'));
    document.getElementById('approved-btn').addEventListener('click', () => fetchRequests(email, 'approved'));
    document.getElementById('cancelled-btn').addEventListener('click', () => fetchRequests(email, 'cancelled'));
    document.getElementById('rejected-btn').addEventListener('click', () => fetchRequests(email, 'rejected'));

    // Fetch "Pending" requests by default
    fetchRequests(email, 'pending');

    // Logout button listener
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.clear(); // Clear all localStorage
        window.location.href = '/steerhub_guest_management/pages/research-center-login/'; // Redirect to login page (or any other page)
    });

    // Save action button listener
    document.getElementById('save-action').addEventListener('click', () => {
        const status = document.getElementById('status-select').value;
        const remarks = document.getElementById('center-remarks').value;

        saveAction(currentRequestId, status, remarks);
    });
});

function fetchRequests(email, status) {
    const tableBody = document.getElementById('requests-table-body');

    // Clear any existing rows in the table before fetching new data
    tableBody.innerHTML = '';

    const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/research-center-requests/?email=${encodeURIComponent(email)}&status=${encodeURIComponent(status)}`;
    console.log('API URL:', apiUrl);  // Debugging the constructed URL

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${status} requests: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.error(`Error fetching ${status} requests:`, error);
            displayNA();
        });
}

function populateTable(requests) {
    const tableBody = document.getElementById('requests-table-body');

    if (requests.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="8">No requests found.</td>`;
        tableBody.appendChild(emptyRow);
    } else {
        requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        requests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.created_at}</td>
                <td>${request.request_id}</td>
                <td>${request.requestor}</td>
                <td>${request.purpose}</td>
                <td>${request.visit_date}</td>
                <td>${request.visit_type}</td>
                <td>${request.duration}</td>
                <td><button class="btn btn-primary btn-sm" onclick="openActionModal('${request.request_id}')">Action</button></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Attach openActionModal to the window object
window.openActionModal = function(requestId) {
    currentRequestId = requestId;
    document.getElementById('modal-request-id').textContent = requestId;
    const modal = new bootstrap.Modal(document.getElementById('actionModal'));
    modal.show();
}

function saveAction(requestId, status, remarks) {
    const apiUrl = `${CONFIG.API_URL}:${CONFIG.API_PORT}/update-request-status/`;
    console.log('API URL:', apiUrl);  // Debugging the constructed URL

    // Perform PUT request to update the status and remarks
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_id: requestId,
            status: status,
            center_remarks: remarks
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to update request ${requestId}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Request updated successfully:', data);
        const modal = bootstrap.Modal.getInstance(document.getElementById('actionModal'));
        modal.hide();
        // Refresh the table to show updated data
        fetchRequests(localStorage.getItem('email'), 'pending');
    })
    .catch(error => {
        console.error(`Error updating request ${requestId}:`, error);
    });
}

function displayNA() {
    const tableBody = document.getElementById('requests-table-body');
    const naRow = document.createElement('tr');
    naRow.innerHTML = `
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `;
    tableBody.appendChild(naRow);
}
