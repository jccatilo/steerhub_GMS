import"./modulepreload-polyfill-B5Qt9EMX.js";import{M as c}from"./bootstrap.esm-D_59DZ1Y.js";let a=null;document.addEventListener("DOMContentLoaded",()=>{const t=localStorage.getItem("email");if(!t){console.error("No email found in localStorage");return}const d=t.split("@")[0].toUpperCase();document.getElementById("greeting").textContent=`Hi, ${d} admin`,document.getElementById("pending-btn").addEventListener("click",()=>o(t,"pending")),document.getElementById("approved-btn").addEventListener("click",()=>o(t,"approved")),document.getElementById("cancelled-btn").addEventListener("click",()=>o(t,"cancelled")),document.getElementById("rejected-btn").addEventListener("click",()=>o(t,"rejected")),o(t,"pending"),document.getElementById("logout-btn").addEventListener("click",()=>{localStorage.clear(),window.location.href="login.html"}),document.getElementById("save-action").addEventListener("click",()=>{const n=document.getElementById("status-select").value,e=document.getElementById("center-remarks").value;r(a,n,e)})});function o(t,d){const n=document.getElementById("requests-table-body");n.innerHTML="",fetch(`http://localhost:81/research-center-requests/?email=${encodeURIComponent(t)}&status=${encodeURIComponent(d)}`).then(e=>{if(!e.ok)throw new Error(`Failed to fetch ${d} requests: ${e.statusText}`);return e.json()}).then(e=>{l(e)}).catch(e=>{console.error(`Error fetching ${d} requests:`,e),i()})}function l(t){const d=document.getElementById("requests-table-body");if(t.length===0){const n=document.createElement("tr");n.innerHTML='<td colspan="8">No requests found.</td>',d.appendChild(n)}else t.sort((n,e)=>new Date(e.created_at)-new Date(n.created_at)),t.forEach(n=>{const e=document.createElement("tr");e.innerHTML=`
                <td>${n.created_at}</td>
                <td>${n.request_id}</td>
                <td>${n.requestor}</td>
                <td>${n.purpose}</td>
                <td>${n.visit_date}</td>
                <td>${n.visit_type}</td>
                <td>${n.duration}</td>
                <td><button class="btn btn-primary btn-sm" onclick="openActionModal('${n.request_id}')">Action</button></td>
            `,d.appendChild(e)})}window.openActionModal=function(t){a=t,document.getElementById("modal-request-id").textContent=t,new c(document.getElementById("actionModal")).show()};function r(t,d,n){fetch("http://localhost:81/update-request-status/",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:t,status:d,center_remarks:n})}).then(e=>{if(!e.ok)throw new Error(`Failed to update request ${t}: ${e.statusText}`);return e.json()}).then(e=>{console.log("Request updated successfully:",e),c.getInstance(document.getElementById("actionModal")).hide(),o(localStorage.getItem("email"),"pending")}).catch(e=>{console.error(`Error updating request ${t}:`,e)})}function i(){const t=document.getElementById("requests-table-body"),d=document.createElement("tr");d.innerHTML=`
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `,t.appendChild(d)}
