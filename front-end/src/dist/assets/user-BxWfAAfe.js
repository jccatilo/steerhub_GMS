import"./modulepreload-polyfill-B5Qt9EMX.js";import{M as c,T as _}from"./bootstrap.esm-D_59DZ1Y.js";document.addEventListener("DOMContentLoaded",()=>{const b=localStorage.getItem("isAuthenticated"),d=localStorage.getItem("authToken"),q=localStorage.getItem("username"),l=localStorage.getItem("email");if(!b||!d){window.location.href="../";return}document.getElementById("username").innerText=q;const w={approved:`http://localhost:81/visit-requests/?email=${l}&status_type=approved`,pending:`http://localhost:81/visit-requests/?email=${l}&status_type=pending`,rejected:`http://localhost:81/visit-requests/?email=${l}&status_type=rejected`},u=document.getElementById("content"),h=document.querySelectorAll(".nav-link"),p=async e=>{try{const o=await fetch(w[e]);if(!o.ok)throw new Error("Network response was not ok");const t=await o.json();console.log(t),u.innerHTML=`<h3>${E(e)} Requests</h3>`;const a=document.createElement("table");a.className="table table-striped";const s=document.createElement("thead");s.innerHTML=`
        <tr>
          <th scope="col">Request ID</th>
          <th scope="col">Place to be visited</th>
          <th scope="col">Date of Visit</th>
          <th scope="col">Creation date</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      `,a.appendChild(s);const r=document.createElement("tbody");t.forEach(n=>{const m=document.createElement("tr");m.innerHTML=`
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
        `,r.appendChild(m)}),a.appendChild(r),u.appendChild(a)}catch(o){console.error("Error fetching requests:",o),u.innerHTML="<h3>No requests found.</h3>"}};window.generateQrCode=(e,o,t,a)=>{const s=JSON.stringify({request_id:e,research_center:o,visit_date:t,status:a}),r=document.getElementById("qrcode");r.innerHTML="",QRCode?new QRCode(r,{text:s,width:128,height:128}):console.error("QRCode library not loaded.");const n=document.getElementById("imageModalLabel");n.textContent=`QR Code for Request ID: ${e}`,new c(document.getElementById("imageModal")).show()},window.generatePdf=(e,o,t)=>{new c(document.getElementById("underConstructionModal")).show()};const g=document.getElementById("followUpModal");g.addEventListener("show.bs.modal",e=>{const t=e.relatedTarget.getAttribute("data-bs-request-id");document.getElementById("sendFollowUpEmail").onclick=function(){f(t)}});const f=async e=>{try{if((await fetch("http://localhost:81/send-follow-up-email/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({request_id:e})})).ok)new _(document.getElementById("followUpToast")).show();else throw new Error("Failed to send follow-up email")}catch(t){console.error("Error sending follow-up email:",t),alert("Failed to send follow-up email. Please try again.")}c.getInstance(g).hide()},E=e=>e.charAt(0).toUpperCase()+e.slice(1);h.forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();const t=e.id.split("-")[0];h.forEach(a=>a.classList.remove("active")),e.classList.add("active"),p(t)})}),p("approved");let i=null;const y=document.getElementById("are_you_sure_cancel_modal");y.addEventListener("show.bs.modal",e=>{i=e.relatedTarget.getAttribute("data-bs-request-id");const t=document.getElementById("request-id-display");t.textContent=i});const I=async e=>{try{const t=await fetch("http://localhost:81/update-request-status/",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({request_id:e,status:"cancelled",center_remarks:"cancelled by requestor"})});if(t.ok){const a=await t.json();console.log("Request cancelled:",a),alert("Your request has been cancelled successfully."),p("pending")}else throw new Error("Failed to cancel the request")}catch(t){console.error("Error cancelling request:",t),alert("Failed to cancel the request. Please try again.")}c.getInstance(y).hide()};document.getElementById("confirmCancelRequest").onclick=function(){i&&I(i)};let v="group";document.getElementById("appointmentForm").addEventListener("submit",async e=>{e.preventDefault();const o={research_center:document.getElementById("researchCenter").value,visit_type:v,visit_date:document.getElementById("appointmentDate").value,duration:document.getElementById("visitDuration").value,requestor:l,purpose:document.getElementById("purpose").value};console.log(o);try{if((await fetch("http://localhost:81/request-visit/",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify(o)})).ok){alert("Appointment successfully created!");const a=document.getElementById("appointmentModal");c.getInstance(a).hide()}else throw new Error("Failed to create appointment")}catch(t){console.error("Error creating appointment:",t),alert("Failed to create appointment. Please try again.")}})});
