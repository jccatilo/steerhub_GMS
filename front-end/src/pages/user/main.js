import './styles.scss'
import * as bootstrap from 'bootstrap'

document.addEventListener('DOMContentLoaded', () => {

    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authToken = localStorage.getItem('authToken');

    // if (!isAuthenticated || !authToken) {
    //     // If not authenticated, redirect to the login page
    //     window.location.href = '../';
    //     return;
    // }


  const username = 'John Doe'; // Replace with the actual username
  document.getElementById('username').innerText = username;

  const endpoints = {
    approved: 'https://api.sampleapis.com/beers/ale',
    pending: 'https://api.sampleapis.com/beers/stouts',
    rejected: 'https://api.sampleapis.com/beers/red-ale',
    past: 'https://api.sampleapis.com/beers/ale'
  };

  const contentDiv = document.getElementById('content');
  const links = document.querySelectorAll('.nav-link');

  // Function to fetch and display requests
  const loadRequests = async (type) => {
    try {
      const response = await fetch(endpoints[type]);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      contentDiv.innerHTML = `<h3>${capitalize(type)} Requests</h3>`;

      const table = document.createElement('table');
      table.className = 'table table-striped';

      // Create the table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Price</th>
          <th scope="col">Sample</th>
        </tr>
      `;
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement('tbody');

      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#imageModal" data-bs-image="${item.image}" data-bs-name="${item.name}">
              View Image
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      contentDiv.appendChild(table);
    } catch (error) {
      console.error('Error fetching requests:', error);
      contentDiv.innerHTML = `<h3>Error loading ${type} requests. Please try again later.</h3>`;
    }
  };

  // Capitalize function for titles
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Event listeners for navbar links
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.id.split('-')[0];
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      loadRequests(type);
    });
  });

  // Load default view (Approved Requests)
  loadRequests('approved');


   // Handle the modal display
   const imageModal = document.getElementById('imageModal');
   imageModal.addEventListener('show.bs.modal', (event) => {
     const button = event.relatedTarget;
     const imageUrl = button.getAttribute('data-bs-image');
     const imageName = button.getAttribute('data-bs-name');
     
     const modalTitle = imageModal.querySelector('.modal-title');
     const modalImage = imageModal.querySelector('.modal-body img');
     
     modalTitle.textContent = imageName;
     modalImage.src = imageUrl;
   });

    // Handle appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    appointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // const name = username;
        // const date = document.getElementById('appointment-date').value;
        // const time = document.getElementById('appointment-time').value;
        // const groupType = document.querySelector('input[name="groupType"]:checked').value;
        // const purpose = document.getElementById('appointment-purpose').value;

        const appointmentData = {
          username,
          name: username,
          date: document.getElementById('appointmentDate').value,
          groupStatus: document.getElementById('groupCheck').checked,
          purpose: document.getElementById('purpose').value,
          researchCenter: document.getElementById('researchCenter').value
      };

        try {
            const response = await fetch('https://api.example.com/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                alert('Appointment successfully created!');
                // Optionally close the modal
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

});
