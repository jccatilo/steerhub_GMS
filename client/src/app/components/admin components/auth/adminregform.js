"use client";

import React, { useState } from "react";
import axios from "../../../api/axios"; // Assuming this axios instance is configured correctly

const AdminLogin = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/admin/login", { username, password });

      if (response.status === 200 && response.data.adminToken) {
        localStorage.setItem("adminToken", response.data.adminToken);
        window.location.href = `/pages/admin/maps`;
      } else {
        setLoginError("Login failed. Please try again later.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response && error.response.status === 401
          ? "Invalid username or password"
          : "Login failed. Please try again later.";
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="h-full flex flex-col items-center justify-center p-4">
        <img
          src={`${basePath}/logon1.png`}
          className="w-16 h-15 sm:w-64 sm:h-63 mt-4 sm:my-4"
          alt="Logo"
        />
        <h1 className="text-xl sm:text-4xl font-bold text-white sm:mb-2 text-center sm:text-left">
          Batangas State University
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
          LIGTAS
        </p>
      </div>
      <div className="h-full flex flex-col justify-start p-4">
        <h1 className="text-md sm:text-2xl font-semibold text-white mb-3 sm:mb-5 text-center sm:text-left">
          Login Account
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg h-full sm:pr-2">
              <div className="mb-1">
                <label
                  htmlFor="username"
                  className="block mb-1 text-sm text-white hidden sm:block"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 sm:p-3"
                  placeholder="Enter Username"
                  required
                />
              </div>
            </div>
            <div className="rounded-lg h-full sm:pr-2">
              <div className="mb-1">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm text-white hidden sm:block"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 sm:p-3"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>
          </div>
          {loginError && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {loginError}
            </p>
          )}
          <div className="flex justify-center items-center p-4">
            <button
              type="submit"
              className="text-black bg-white text-md sm:text-lg focus:ring-1 focus:outline-none focus:ring-[#FFD910]/50 font-medium rounded-md text-sm py-2 w-full w-44 sm:w-64 inline-flex justify-center items-center mb-2 transition duration-300 ease-in-out hover:bg-red-800 hover:text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
