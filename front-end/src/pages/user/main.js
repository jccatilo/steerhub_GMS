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
          <td><img src="${item.image}" alt="${item.name}"></td>
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
});
