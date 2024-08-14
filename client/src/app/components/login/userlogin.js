"use client";

import React, { useState } from "react";
import axios from "../../api/axios";
import { jwtDecode } from "jwt-decode"; // Corrected import statement

function UserLogin() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        email,
        user_password,
      });

      if (response.status === 200 && response.data.userToken) {
        const userToken = response.data.userToken;
        localStorage.setItem("userToken", userToken);

        // Store profile image URL in localStorage
        const decodedToken = jwtDecode(userToken);
        localStorage.setItem("profileImage", decodedToken.profile_image);

        // Redirect to home page
        window.location.href = `/pages/home/`;
      } else {
        setLoginError("Login failed. Please try again later.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setLoginError("Invalid email or password");
      } else {
        setLoginError("Login failed. Please try again later.");
      }
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
        <h1 className="w-full text-xl sm:text-4xl font-bold text-white sm:mb-2 text-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg">
              <label
                htmlFor="email"
                className="block text-sm text-white mb-1 sm:mb-0"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 sm:p-3"
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="rounded-lg">
              <label
                htmlFor="password"
                className="block text-sm text-white mb-1 sm:mb-0"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={user_password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 sm:p-3"
                placeholder="Enter Password"
                required
              />
            </div>
          </div>
          {loginError && (
            <p className="text-red-500 text-sm mb-3">{loginError}</p>
          )}
          <div className="flex justify-center items-center p-4">
            <button
              type="submit"
              className="text-black bg-white text-md sm:text-lg focus:ring-1 focus:outline-none focus:ring-[#FFD910]/50 font-medium rounded-md text-sm py-2 text-center w-full sm:w-64 inline-flex justify-center items-center mb-2 transition duration-300 ease-in-out hover:bg-red-800 hover:text-white"
            >
              Login
            </button>
          </div>
        </form>
        <div className="my-6 text-center">
          <div className="flex items-center justify-center">
            <hr className="border-t-2 border-yellow-400 w-full" />
            <span className="mx-2 text-white uppercase tracking-wide">Or</span>
            <hr className="border-t-2 border-yellow-400 w-full" />
          </div>
        </div>
        <div className="flex justify-center items-center mb-5">
          <button
            type="button"
            className="text-black bg-white text-md sm:text-lg focus:ring-1 focus:outline-none focus:ring-[#FFD910]/50 font-medium rounded-md text-sm px-4 py-2 text-center sm:w-64 inline-flex justify-center items-center mb-2 transition duration-300 ease-in-out hover:bg-red-800 hover:text-white"
            onClick={() =>
              (window.location.href = "https://api-ligtas.parallaxed.ph/auth/google")
            }
          >
            <img
              src={`${basePath}/googleicon.png`}
              className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
              alt="Google icon"
            />
            Google
          </button>
        </div>
        <p className="text-white mb-1 text-center text-xs sm:text-lg sm:text-left">
          Don&apos;t have an account?{" "}
          <a href="/" className="text-[#FFD910] underline underline-offset-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
