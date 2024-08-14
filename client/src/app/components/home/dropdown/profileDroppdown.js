"use client";

import React, { useState, useRef, useEffect } from "react";

export default function ProfileDropdown({ profileImage, handleDeleteAccount }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleSubmit = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/pages/login/";
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (

    <div className="relative" ref={profileDropdownRef}>
      <img
        src={profileImage}
        alt="Profile"
        className="w-14 h-14 sm:w-14 sm:h-14 rounded-md cursor-pointer"
        onClick={toggleProfileDropdown}
      />
      {profileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={handleDeleteAccount}
            className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
          >
            Delete Account
          </button>
          <button
            onClick={handleSubmit}
            className="block px-4 py-2 text-sm text-blue-700 hover:bg-gray-100 w-full text-left"
          >
            Logout
          </button>
        </div>



        
      )}
    </div>

    
  );
}
