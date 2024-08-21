import './styles.scss'
import * as bootstrap from 'bootstrap'

document.addEventListener('DOMContentLoaded', () => {

    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email')
    // const username = localStorage.getItem('authToken');


    if (!isAuthenticated || !authToken) {
        // If not authenticated, redirect to the login page
        window.location.href = '../';
        return;
    }


  // const username = 'John Doe'; // Replace with the actual username
  document.getElementById('username').innerText = username;


  const endpoints = {
    approved:`http://localhost:81/visit-requests/?email=${email}&status_type=approved`,
    pending: `http://localhost:81/visit-requests/?email=${email}&status_type=pending`,
    rejected: `http://localhost:81/visit-requests/?email=${email}&status_type=rejected`
    // past: 'https://api.sampleapis.com/beers/ale'
  };

  const contentDiv = document.getElementById('content');
  const links = document.querySelectorAll('.nav-link');

  // Function to fetch and display requests
  const loadRequests = async (type) => {
    try {
      const response = await fetch(endpoints[type]);

      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data)
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
          <th scope="col">Status</th>
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
          <td>${item.status}</td>
          <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#imageModal" data-bs-image="${item.image}" data-bs-name="${item.name}">
              Generate QR
            </button>
          </td>
          <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#are_you_sure_cancel_modal" data-bs-image="${item.image}" data-bs-name="${item.name}">
              X
            </button>
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

//   let mapping_research_center_to_email = {
//     "Likha Fablab": "fablab@g.batstate-u.edu.ph",
//     "Material Testing and Calibration Center": "value2",
//     "GIS Development Center": "value2",
//     "Electronics Systems Research Center": "value2",
//     "Center for Technopreneurship and Innovation": "value2",
//     "Digital Transformation Center": "value2",
//     "Office of the Director of STEER Hub": "value2",
//     "Center for Innovation in Engineering Education": "value2",
//     "KIST Park Office": "value2",
//     key3: "value3"
// };
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
   const cancelModal  = document.getElementById('are_you_sure_cancel_modal');
   cancelModal.addEventListener('show.bs.modal', (event) => {
     const button = event.relatedTarget;
     const imageUrl = button.getAttribute('data-bs-image');
     const imageName = button.getAttribute('data-bs-name');
     
     const modalTitle = imageModal.querySelector('.modal-title');
     const modalImage = imageModal.querySelector('.modal-body img');
     
     modalTitle.textContent = imageName;
     modalImage.src = imageUrl;
   });



   let tdd_visit_type = "group";
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
          research_center:document.getElementById('researchCenter').value,
          // visit_type: document.getElementById('groupCheck').checked,
          visit_type:tdd_visit_type,
          visit_date: document.getElementById('appointmentDate').value,
          duration: document.getElementById('visitDuration').value,
          requestor: email,
          purpose: document.getElementById('purpose').value
          
      };
      console.log(appointmentData)

        try {
            const response = await fetch('http://localhost:81/request-visit/', {
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
