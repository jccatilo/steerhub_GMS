"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/app/components/admin components/home/sidebar";
import Dashboardbg from "@/app/components/admin components/home/dashboardbg";

const LeafletMap = dynamic(
  () => import("@/app/components/admin components/home/map"),
  {
    ssr: false, // This ensures the map is rendered only on the client side
  }
);

function MapsPage() {
  const [adminToken, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");

    if (!storedToken) {
      window.location.href = "/pages/admin/login";
    } else {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token has expired
          localStorage.removeItem("adminToken");
          window.location.href = "/pages/admin/login";
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        // If there's an error decoding the token, remove it and redirect to login
        localStorage.removeItem("adminToken");
        window.location.href = "/pages/admin/login";
      }
    }
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* Background Regcard */}
      <div className="absolute inset-0 z-0">
        <Dashboardbg />
      </div>
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative z-20 md:p-4">
          <Sidebar />
        </div>

        <div className="relative p-4 w-full flex-1">
          <div className="mt-12 md:mt-3">
            <p className="font-medium text-white text-sm mb-5">
              Pages/ Map Dashboard
            </p>
            <h1 className="font-semibold text-white text-md">Map Dashboard</h1>
          </div>
          <div className="w-full h-64 my-7">
            {adminToken && <LeafletMap adminToken={adminToken} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapsPage;
