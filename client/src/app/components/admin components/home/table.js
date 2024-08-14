"use client";
import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api/axios";
import moment from "moment";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const range = 2;
  const pageLimit = 3;

  let startPage = Math.max(1, currentPage - range);
  let endPage = Math.min(totalPages, currentPage + range);

  if (totalPages <= pageLimit) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage + range > totalPages) {
      startPage = Math.max(1, totalPages - pageLimit + 1);
      endPage = totalPages;
    }

    if (currentPage - range < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, pageLimit);
    }
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <nav aria-label="Page navigation example">
      <ul className="flex justify-center space-x-2 p-2 h-12 text-base">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-white bg-red-800 border rounded-s-lg hover:bg-red-900 hover:text-white ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              onClick={() => handlePageChange(pageNumber)}
              className={`flex items-center justify-center px-4 h-10 leading-tight ${
                pageNumber === currentPage
                  ? "text-red-500 bg-white border border-red-300 hover:bg-gray-100 hover:text-red-700"
                  : "text-white bg-red-800 border hover:bg-red-900"
              }`}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-white bg-red-800 border rounded-e-lg hover:bg-red-900 hover:text-white ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default function Table() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");
        const sortedUsers = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, currentPage, usersPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search Bar Centered for Smaller Screens */}
      <div className="md:hidden flex justify-center mb-4">
        <div className="relative w-full max-w-md mx-auto">
          <label htmlFor="table-search-mobile" className="sr-only">
            Search
          </label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-mobile"
            className="block w-full py-2 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Search Bar Inside the Card for Larger Screens */}
      <div className="hidden md:flex md:justify-start bg-white rounded-t-lg">
        <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-md my-3 rounded-sm">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block w-full py-2 pl-10 pr-4 text-sm text-gray-700 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Card with Search Bar for Larger Screens */}
      <div className="relative overflow-x-auto shadow-md">
        <table className="w-full text-sm text-center text-gray-900">
          <thead className="text-xs text-white uppercase bg-red-950">
            <tr>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3">
                USERS
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3">
                NAME
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3">
                EMAIL
              </th>
              <th scope="col" className="px-2 py-2 md:px-6 md:py-3">
                DATE CREATED
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index} className="bg-white border-b text-gray-600">
                <td className="px-2 py-2 md:px-6 md:py-4 text-center">
                  {user.profile_image && (
                    <img
                      src={user.profile_image}
                      alt="Profile Image"
                      className="inline-block h-10 w-10 rounded-md"
                    />
                  )}
                </td>
                <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-base">
                  {user.name ? user.name : user.username}
                </td>
                <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-base">
                  {user.email}
                </td>
                <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-base">
                  {moment(user.createdAt).format("YYYY-MM-DD")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
