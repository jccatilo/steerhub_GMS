"use client";

import React, { useState, useEffect } from "react";
import CustomWebcam from "@/app/components/home/customwebcam";
import Homebg from "@/app/components/home/homebg";
import ProfileDropdown from "../../components/home/dropdown/profileDroppdown";
import NotificationDropdown from "../../components/home/dropdown/notificationDropdown";
import { jwtDecode } from "jwt-decode";
import axios from "../../api/axios";

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/pages/login/";
  };

  const handleDeleteAccount = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      await axios.delete(`/api/${userId}`, {
        headers: { Authorization: userToken },
      });
      handleSubmit(); // Logout after account deletion
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    let userToken = localStorage.getItem("userToken");

    if (!userToken) {
      const urlParams = new URLSearchParams(window.location.search);
      userToken = urlParams.get("userToken");
    }

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        setUserName(decodedToken.name);
        setUserId(decodedToken.id);
        setProfileImage(decodedToken.profile_image);
        localStorage.setItem("userToken", userToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        redirectToLogin();
      }
    } else {
      console.error("Token is missing");
      redirectToLogin();
    }
  }, []);

  const redirectToLogin = () => {
    window.location.href = "/pages/login/";
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Homebg />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-center p-4 sm:p-10">
          <h1 className="text-lg sm:text-xl text-white font-semibold">
            Hello, {userName || "Guest"}
          </h1>

          <div className="relative flex items-center">
            <NotificationDropdown userId={userId} />
            <ProfileDropdown
              profileImage={profileImage || "/profilePic.png"}
              handleDeleteAccount={handleDeleteAccount}
            />
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center pb-2 sm:pb-7">
          <CustomWebcam user={userId} />
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={handleSubmit}
            className="flex items-center bg-white rounded-lg w-24 p-2 sm:w-32 sm:p-4 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 sm:w-6 sm:h-6 text-red-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            <p className="text-sm sm:text-base font-semibold text-red-700 ml-2">
              Log-out
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
