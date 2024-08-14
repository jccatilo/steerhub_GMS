"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "../../../api/axios";

export default function NotificationDropdown({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [markedNotifications, setMarkedNotifications] = useState([]);
  const notificationDropdownRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const formatNotificationTime = (time) => {
    return `[${time}]`;
  };

  const toggleNotificationDropdown = (e) => {
    e.stopPropagation(); // Stop event propagation
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target) &&
      (!deleteButtonRef.current || !deleteButtonRef.current.contains(event.target))) {
      setNotificationDropdownOpen(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      await axios.delete(`/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkNotification = (notificationId) => {
    if (markedNotifications.includes(notificationId)) {
      setMarkedNotifications((prevMarks) =>
        prevMarks.filter((mark) => mark !== notificationId)
      );
    } else {
      setMarkedNotifications((prevMarks) => [...prevMarks, notificationId]);
    }
  };

  const handleDeleteMarkedNotifications = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      await Promise.all(
        markedNotifications.map(async (notificationId) => {
          await axios.delete(`/api/notifications/${notificationId}`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
        })
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => !markedNotifications.includes(notification.id)
        )
      );
      setMarkedNotifications([]);
    } catch (error) {
      console.error("Error deleting marked notifications:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await axios.get(`/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

    // Set up polling to fetch notifications every 30 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        if (userId) {
          fetchNotifications();
        }
      }, 3000); // 30 seconds
  
      return () => clearInterval(interval); // Clean up interval on component unmount
    }, [userId]);

  return (
    <div className="relative mx-4" ref={notificationDropdownRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 text-white cursor-pointer"
        onClick={toggleNotificationDropdown}
      >
        <path
          fillRule="evenodd"
          d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
          clipRule="evenodd"
        />
      </svg>

      {notificationDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-2 flex justify-between items-center"
              >
                <div className="flex items-center">
                  {markedNotifications.includes(notification.id) ? (
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-red-600 cursor-pointer"
                      checked
                      onChange={() => handleMarkNotification(notification.id)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-red-600 cursor-pointer"
                      onChange={() => handleMarkNotification(notification.id)}
                    />
                  )}
                  <p className="text-sm ml-2">{notification.message}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {formatNotificationTime(notification.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <div className="px-4 py-2">
              <p className="text-sm text-gray-500">
                There are no new notifications.
              </p>
            </div>
          )}

          {markedNotifications.length > 0 && (
            <div className="px-4 py-2 flex justify-end">
              <button
                ref={deleteButtonRef}
                // onClick={handleDeleteMarkedNotifications}
                onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  handleDeleteMarkedNotifications();
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
