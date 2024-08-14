"use client";

import React from "react";

function Adminregcard() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="h-screen w-screen overflow-hidden">
      <img src={`${basePath}/regcover.png`} className="object-cover w-full h-full" as="image"/>
    </div>
  );
}

export default Adminregcard;
