"use client";

import React from "react";
// import { useRouter } from 'next/router';
// import Image from 'next/image';

function Regcard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div className="h-screen w-screen overflow-hidden">
      <img src={`${basePath}/admin_login.png`} className="object-cover w-full h-full" alt="regcover" as="image"/>
    </div>
  );
}

export default Regcard;
