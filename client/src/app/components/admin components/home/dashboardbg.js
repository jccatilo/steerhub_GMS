"use client";

import React from "react";
// import { useRouter } from 'next/router';

function Regcard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div className="h-screen w-screen overflow-hidden">
      <img src={`${basePath}/admin_dashboard.png`} className="object-cover w-full h-full" />
    </div>
  );
}

export default Regcard;
