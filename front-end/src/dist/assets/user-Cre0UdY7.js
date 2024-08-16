import{M as b}from"./bootstrap.esm-CPz0pknf.js";document.addEventListener("DOMContentLoaded",()=>{localStorage.getItem("isAuthenticated");const u=localStorage.getItem("authToken"),c="John Doe";document.getElementById("username").innerText=c;const h={approved:"https://api.sampleapis.com/beers/ale",pending:"https://api.sampleapis.com/beers/stouts",rejected:"https://api.sampleapis.com/beers/red-ale",past:"https://api.sampleapis.com/beers/ale"},d=document.getElementById("content"),m=document.querySelectorAll(".nav-link"),i=async e=>{try{const t=await fetch(h[e]);if(!t.ok)throw new Error("Network response was not ok");const n=await t.json();d.innerHTML=`<h3>${g(e)} Requests</h3>`;const a=document.createElement("table");a.className="table table-striped";const o=document.createElement("thead");o.innerHTML=`
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Price</th>
          <th scope="col">Sample</th>
        </tr>
      `,a.appendChild(o);const r=document.createElement("tbody");n.forEach(s=>{const p=document.createElement("tr");p.innerHTML=`
          <td>${s.name}</td>
          <td>${s.price}</td>
          <td>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#imageModal" data-bs-image="${s.image}" data-bs-name="${s.name}">
              View Image
            </button>
          </td>
        `,r.appendChild(p)}),a.appendChild(r),d.appendChild(a)}catch(t){console.error("Error fetching requests:",t),d.innerHTML=`<h3>Error loading ${e} requests. Please try again later.</h3>`}},g=e=>e.charAt(0).toUpperCase()+e.slice(1);m.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const n=e.id.split("-")[0];m.forEach(a=>a.classList.remove("active")),e.classList.add("active"),i(n)})}),i("approved");const l=document.getElementById("imageModal");l.addEventListener("show.bs.modal",e=>{const t=e.relatedTarget,n=t.getAttribute("data-bs-image"),a=t.getAttribute("data-bs-name"),o=l.querySelector(".modal-title"),r=l.querySelector(".modal-body img");o.textContent=a,r.src=n}),document.getElementById("appointmentForm").addEventListener("submit",async e=>{e.preventDefault();const t={username:c,name:c,date:document.getElementById("appointmentDate").value,groupStatus:document.getElementById("groupCheck").checked,purpose:document.getElementById("purpose").value,researchCenter:document.getElementById("researchCenter").value};try{if((await fetch("https://api.example.com/appointments",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify(t)})).ok){alert("Appointment successfully created!");const a=document.getElementById("appointmentModal");b.getInstance(a).hide()}else throw new Error("Failed to create appointment")}catch(n){console.error("Error creating appointment:",n),alert("Failed to create appointment. Please try again.")}})});
