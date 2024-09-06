import{C as a}from"./gms_config-DEWirCIn.js";import{M as l}from"./bootstrap.esm-D_59DZ1Y.js";let r=null;document.addEventListener("DOMContentLoaded",()=>{const t=localStorage.getItem("email");if(!t){console.error("No email found in localStorage");return}const o=t.split("@")[0].toUpperCase();document.getElementById("greeting").textContent=`Hi, ${o} admin`,document.getElementById("pending-btn").addEventListener("click",()=>c(t,"pending")),document.getElementById("approved-btn").addEventListener("click",()=>c(t,"approved")),document.getElementById("cancelled-btn").addEventListener("click",()=>c(t,"cancelled")),document.getElementById("rejected-btn").addEventListener("click",()=>c(t,"rejected")),c(t,"pending"),document.getElementById("logout-btn").addEventListener("click",()=>{localStorage.clear(),window.location.href="/steerhub_guest_management/pages/research-center-login/"}),document.getElementById("save-action").addEventListener("click",()=>{const e=document.getElementById("status-select").value,d=document.getElementById("center-remarks").value;s(r,e,d)})});function c(t,o){const e=document.getElementById("requests-table-body");e.innerHTML="";const d=`${a.API_URL}:${a.API_PORT}/research-center-requests/?email=${encodeURIComponent(t)}&status=${encodeURIComponent(o)}`;console.log("API URL:",d),fetch(d).then(n=>{if(!n.ok)throw new Error(`Failed to fetch ${o} requests: ${n.statusText}`);return n.json()}).then(n=>{i(n)}).catch(n=>{console.error(`Error fetching ${o} requests:`,n),m()})}function i(t){const o=document.getElementById("requests-table-body");if(t.length===0){const e=document.createElement("tr");e.innerHTML='<td colspan="8">No requests found.</td>',o.appendChild(e)}else t.sort((e,d)=>new Date(d.created_at)-new Date(e.created_at)),t.forEach(e=>{const d=document.createElement("tr");d.innerHTML=`
                <td>${e.created_at}</td>
                <td>${e.request_id}</td>
                <td>${e.requestor}</td>
                <td>${e.purpose}</td>
                <td>${e.visit_date}</td>
                <td>${e.visit_type}</td>
                <td>${e.duration}</td>
                <td><button class="btn btn-primary btn-sm" onclick="openActionModal('${e.request_id}')">Action</button></td>
            `,o.appendChild(d)})}window.openActionModal=function(t){r=t,document.getElementById("modal-request-id").textContent=t,new l(document.getElementById("actionModal")).show()};function s(t,o,e){const d=`${a.API_URL}:${a.API_PORT}/update-request-status/`;console.log("API URL:",d),fetch(d,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:t,status:o,center_remarks:e})}).then(n=>{if(!n.ok)throw new Error(`Failed to update request ${t}: ${n.statusText}`);return n.json()}).then(n=>{console.log("Request updated successfully:",n),l.getInstance(document.getElementById("actionModal")).hide(),c(localStorage.getItem("email"),"pending")}).catch(n=>{console.error(`Error updating request ${t}:`,n)})}function m(){const t=document.getElementById("requests-table-body"),o=document.createElement("tr");o.innerHTML=`
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `,t.appendChild(o)}
