import './styles.scss'
import * as bootstrap from 'bootstrap'
import { CONFIG } from '../../gms_config.js';  // Import the configuration from gms_config.js

document.addEventListener('DOMContentLoaded', () => {

    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!isAuthenticated || !authToken) {
        // If not authenticated, redirect to the login page
        window.location.href = '../';
        return;
    }

    document.getElementById('username').innerText = username;

    // Construct the API endpoints dynamically
    const endpoints = {
        approved: `${CONFIG.API_URL}:${CONFIG.API_PORT}/visit-requests/?email=${encodeURIComponent(email)}&status_type=approved`,
        pending: `${CONFIG.API_URL}:${CONFIG.API_PORT}/visit-requests/?email=${encodeURIComponent(email)}&status_type=pending`,
        rejected: `${CONFIG.API_URL}:${CONFIG.API_PORT}/visit-requests/?email=${encodeURIComponent(email)}&status_type=rejected`
    };

    const contentDiv = document.getElementById('content');
    const links = document.querySelectorAll('.nav-link');

    // Function to fetch and display requests
    const loadRequests = async (type) => {
        try {
            const response = await fetch(endpoints[type], {
                headers: {
                    'Authorization': `Bearer ${authToken}`  // Include the auth token in the request headers
                }
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log(data);
            contentDiv.innerHTML = `<h3>${capitalize(type)} Requests</h3>`;

            const table = document.createElement('table');
            table.className = 'table table-striped';

            // Create the table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th scope="col">Request ID</th>
                    <th scope="col">Place to be visited</th>
                    <th scope="col">Date of Visit</th>
                    <th scope="col">Creation date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            `;
            table.appendChild(thead);

            // Create the table body
            const tbody = document.createElement('tbody');

            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.request_id}</td>
                    <td>${item.research_center.split("@")[0].toUpperCase()}</td>
                    <td>${item.visit_date}</td>
                    <td>${item.created_at}</td>
                    <td>${item.status}</td>
                    <td>
                        ${type === 'pending' ? `
                            <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#followUpModal" data-bs-request-id="${item.request_id}">
                                Follow Up
                            </button>
                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#are_you_sure_cancel_modal" data-bs-request-id="${item.request_id}">
                                X
                            </button>
                        ` : ''}
                        ${type === 'approved' ? `
                            <button class="btn btn-primary" onclick="generateQrCode('${item.request_id}', '${item.research_center}', '${item.visit_date}','${item.status}')">
                                Generate QR
                            </button>
                            <button class="btn btn-secondary" onclick="generatePdf('${item.request_id}', '${item.research_center}', '${item.visit_date}')">
                                Generate PDF
                            </button>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            contentDiv.appendChild(table);
        } catch (error) {
            console.error('Error fetching requests:', error);
            contentDiv.innerHTML = `<h3>No requests found.</h3>`;
        }
    };

    window.generateQrCode = (requestId, researchCenter, visitDate, visitStatus) => {
        const qrData = JSON.stringify({
            request_id: requestId,
            research_center: researchCenter,
            visit_date: visitDate,
            status: visitStatus
        });

        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = ''; // Clear previous QR code if any

        if (QRCode) {
            new QRCode(qrcodeContainer, {
                text: qrData,
                width: 128,
                height: 128,
            });
        } else {
            console.error('QRCode library not loaded.');
        }

        const modalTitle = document.getElementById('imageModalLabel');
        modalTitle.textContent = `QR Code for Request ID: ${requestId}`;

        const qrModal = new bootstrap.Modal(document.getElementById('imageModal'));
        qrModal.show();
    };

    window.generatePdf = (requestId, researchCenter, visitDate) => {
        const underConstructionModal = new bootstrap.Modal(document.getElementById('underConstructionModal'));
        underConstructionModal.show();

        // Uncomment if generating PDF is required
        // const { jsPDF } = window.jspdf;
        // const doc = new jsPDF();
        // doc.text("Visit Request", 10, 10);
        // doc.text(`Request ID: ${requestId}`, 10, 20);
        // doc.text(`Research Center: ${researchCenter}`, 10, 30);
        // doc.text(`Visit Date: ${visitDate}`, 10, 40);
        // doc.save(`Request_${requestId}.pdf`);
    };

    const followUpModal = document.getElementById('followUpModal');
    followUpModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const requestId = button.getAttribute('data-bs-request-id');

        document.getElementById('sendFollowUpEmail').onclick = function() {
            sendFollowUpEmail(requestId);
        };
    });

    const sendFollowUpEmail = async (requestId) => {
        try {
            const response = await fetch(`${CONFIG.API_URL}:${CONFIG.API_PORT}/send-follow-up-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ request_id: requestId })
            });

            if (response.ok) {
                const toast = new bootstrap.Toast(document.getElementById('followUpToast'));
                toast.show();
            } else {
                throw new Error('Failed to send follow-up email');
            }
        } catch (error) {
            console.error('Error sending follow-up email:', error);
            alert('Failed to send follow-up email. Please try again.');
        }

        const modalInstance = bootstrap.Modal.getInstance(followUpModal);
        modalInstance.hide();
    };

    const cancelRequestModal = document.getElementById('are_you_sure_cancel_modal');
    let currentRequestId = null;

    cancelRequestModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        currentRequestId = button.getAttribute('data-bs-request-id');

        const requestIdDisplay = document.getElementById('request-id-display');
        requestIdDisplay.textContent = currentRequestId;
    });

    const cancelRequest = async (requestId) => {
        try {
            const response = await fetch(`${CONFIG.API_URL}:${CONFIG.API_PORT}/update-request-status/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    request_id: requestId,
                    status: "cancelled",
                    center_remarks: "cancelled by requestor"
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Request cancelled:', result);
                alert('Your request has been cancelled successfully.');
                loadRequests('pending');
            } else {
                throw new Error('Failed to cancel the request');
            }
        } catch (error) {
            console.error('Error cancelling request:', error);
            alert('Failed to cancel the request. Please try again.');
        }

        const modalInstance = bootstrap.Modal.getInstance(cancelRequestModal);
        modalInstance.hide();
    };

    document.getElementById('confirmCancelRequest').onclick = function() {
        if (currentRequestId) {
            cancelRequest(currentRequestId);
        }
    };

    let tdd_visit_type = "group";

    const appointmentForm = document.getElementById('appointmentForm');
    appointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const appointmentData = {
            research_center: document.getElementById('researchCenter').value,
            visit_type: tdd_visit_type,
            visit_date: document.getElementById('appointmentDate').value,
            duration: document.getElementById('visitDuration').value,
            requestor: email,
            purpose: document.getElementById('purpose').value
        };

        console.log(appointmentData);

        try {
            const response = await fetch(`${CONFIG.API_URL}:${CONFIG.API_PORT}/request-visit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                alert('Appointment successfully created!');
                const modalElement = document.getElementById('appointmentModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            } else {
                throw new Error('Failed to create appointment');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment. Please try again.');
        }
    });

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const type = link.id.split('-')[0];
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadRequests(type);
        });
    });

    loadRequests('approved');
});
