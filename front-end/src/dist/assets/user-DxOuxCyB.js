import{C as s}from"./gms_config-DP6YQBHw.js";import{M as l,T as v}from"./bootstrap.esm-D_59DZ1Y.js";document.addEventListener("DOMContentLoaded",()=>{const b=localStorage.getItem("isAuthenticated"),r=localStorage.getItem("authToken"),_=localStorage.getItem("username"),i=localStorage.getItem("email");if(!b||!r){window.location.href="../";return}document.getElementById("username").innerText=_;const f={approved:`${s.API_URL}:${s.API_PORT}/visit-requests/?email=${encodeURIComponent(i)}&status_type=approved`,pending:`${s.API_URL}:${s.API_PORT}/visit-requests/?email=${encodeURIComponent(i)}&status_type=pending`,rejected:`${s.API_URL}:${s.API_PORT}/visit-requests/?email=${encodeURIComponent(i)}&status_type=rejected`},p=document.getElementById("content"),g=document.querySelectorAll(".nav-link"),m=async e=>{try{const o=await fetch(f[e],{headers:{Authorization:`Bearer ${r}`}});if(!o.ok)throw new Error("Network response was not ok");const t=await o.json();console.log(t),p.innerHTML=`<h3>${$(e)} Requests</h3>`;const a=document.createElement("table");a.className="table table-striped";const d=document.createElement("thead");d.innerHTML=`
                <tr>
                    <th scope="col">Request ID</th>
                    <th scope="col">Place to be visited</th>
                    <th scope="col">Date of Visit</th>
                    <th scope="col">Creation date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            `,a.appendChild(d);const c=document.createElement("tbody");t.forEach(n=>{const h=document.createElement("tr");h.innerHTML=`
                    <td>${n.request_id}</td>
                    <td>${n.research_center.split("@")[0].toUpperCase()}</td>
                    <td>${n.visit_date}</td>
                    <td>${n.created_at}</td>
                    <td>${n.status}</td>
                    <td>
                        ${e==="pending"?`
                            <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#followUpModal" data-bs-request-id="${n.request_id}">
                                Follow Up
                            </button>
                            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#are_you_sure_cancel_modal" data-bs-request-id="${n.request_id}">
                                X
                            </button>
                        `:""}
                        ${e==="approved"?`
                            <button class="btn btn-primary" onclick="generateQrCode('${n.request_id}', '${n.research_center}', '${n.visit_date}','${n.status}')">
                                Generate QR
                            </button>
                            <button class="btn btn-secondary" onclick="generatePdf('${n.request_id}', '${n.research_center}', '${n.visit_date}')">
                                Generate PDF
                            </button>
                        `:""}
                    </td>
                `,c.appendChild(h)}),a.appendChild(c),p.appendChild(a)}catch(o){console.error("Error fetching requests:",o),p.innerHTML="<h3>No requests found.</h3>"}};window.generateQrCode=(e,o,t,a)=>{const d=JSON.stringify({request_id:e,research_center:o,visit_date:t,status:a}),c=document.getElementById("qrcode");c.innerHTML="",QRCode?new QRCode(c,{text:d,width:128,height:128}):console.error("QRCode library not loaded.");const n=document.getElementById("imageModalLabel");n.textContent=`QR Code for Request ID: ${e}`,new l(document.getElementById("imageModal")).show()},window.generatePdf=(e,o,t)=>{new l(document.getElementById("underConstructionModal")).show()};const y=document.getElementById("followUpModal");y.addEventListener("show.bs.modal",e=>{const t=e.relatedTarget.getAttribute("data-bs-request-id");document.getElementById("sendFollowUpEmail").onclick=function(){q(t)}});const q=async e=>{try{if((await fetch(`${s.API_URL}:${s.API_PORT}/send-follow-up-email/`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({request_id:e})})).ok)new v(document.getElementById("followUpToast")).show();else throw new Error("Failed to send follow-up email")}catch(t){console.error("Error sending follow-up email:",t),alert("Failed to send follow-up email. Please try again.")}l.getInstance(y).hide()},I=document.getElementById("are_you_sure_cancel_modal");let u=null;I.addEventListener("show.bs.modal",e=>{u=e.relatedTarget.getAttribute("data-bs-request-id");const t=document.getElementById("request-id-display");t.textContent=u});const w=async e=>{try{const t=await fetch(`${s.API_URL}:${s.API_PORT}/update-request-status/`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({request_id:e,status:"cancelled",center_remarks:"cancelled by requestor"})});if(t.ok){const a=await t.json();console.log("Request cancelled:",a),alert("Your request has been cancelled successfully."),m("pending")}else throw new Error("Failed to cancel the request")}catch(t){console.error("Error cancelling request:",t),alert("Failed to cancel the request. Please try again.")}l.getInstance(I).hide()};document.getElementById("confirmCancelRequest").onclick=function(){u&&w(u)};let E="group";document.getElementById("appointmentForm").addEventListener("submit",async e=>{e.preventDefault();const o={research_center:document.getElementById("researchCenter").value,visit_type:E,visit_date:document.getElementById("appointmentDate").value,duration:document.getElementById("visitDuration").value,requestor:i,purpose:document.getElementById("purpose").value};console.log(o);try{if((await fetch(`${s.API_URL}:${s.API_PORT}/request-visit/`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify(o)})).ok){alert("Appointment successfully created!");const a=document.getElementById("appointmentModal");l.getInstance(a).hide()}else throw new Error("Failed to create appointment")}catch(t){console.error("Error creating appointment:",t),alert("Failed to create appointment. Please try again.")}});const $=e=>e.charAt(0).toUpperCase()+e.slice(1);g.forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();const t=e.id.split("-")[0];g.forEach(a=>a.classList.remove("active")),e.classList.add("active"),m(t)})}),m("approved")});
