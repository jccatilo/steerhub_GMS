"use client";

import React, { useState, useEffect, useRef } from "react";

const Sidebar = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Toggle sidebar open/close state
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/pages/admin/login"; // Redirect to login page
  };

  // Handle click outside the sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Attach event listeners for click outside and swipe events
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle swipe gestures
  useEffect(() => {
    let startX;

    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchMove = (event) => {
      if (!startX) return;
      const endX = event.touches[0].clientX;
      const distanceX = endX - startX;

      if (distanceX > 50 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (distanceX < -50 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Sidebar Icon */}
      <button
        onClick={handleSidebarToggle}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-red-900 text-white transition-transform duration-300 ${
          isSidebarOpen ? "hidden" : "opacity-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </button>

      {/* Full Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:relative h-full md:h-full px-1 shadow-md py-3 w-64 bg-red-900 md:bg-red-950 rounded-xl p-4 z-10 transition-transform duration-300 ${
          isSidebarOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col">
          {/* Close Button */}
          <button
            onClick={handleSidebarToggle}
            className="lg:hidden p-2 text-white mb-3 w-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col flex-1">
            <div className="flex flex-row items-center justify-center">
              <img
                src={`${basePath}/logon1.png`}
                className="w-11 h-10 md:w-13 md:h-12"
                alt="Logo"
              />
              <p className="text-white font-semibold text-xs md:text-sm px-2">
                Batangas State University
              </p>
            </div>
            <div className="flex justify-center">
              <hr className="border-t-1 border-white w-64 my-3 md:my-5" />
            </div>
            <ul className="space-y-2 mx-4 font-medium flex-1">
              <li>
                <a
                  href="/pages/admin/maps"
                  className="flex items-center p-2 hover:text-red-950 rounded-lg text-white hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 md:size-6 hover:text-red-950"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ms-3 text-xs md:text-base">
                    Map Dashboard
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/pages/admin/accounts"
                  className="flex items-center p-2 hover:text-red-950 rounded-lg text-white hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 md:size-6 hover:text-red-950"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                      clipRule="evenodd"
                    />
                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap text-xs md:text-base">
                    Accounts
                  </span>
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 md:p-3 hover:text-red-950 rounded-lg text-white hover:bg-white w-full text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 md:size-6 hover:text-red-950"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap text-xs md:text-base">
                    Log-Out
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
