import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Popup = ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        setIsOpen(false);
      }, 1400); // Close popup after 1.4 seconds

      return () => clearTimeout(timeout);
    }
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }} // Exit animation properties
          onClick={() => setIsOpen(false)} // Close popup on click outside
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 flex justify-center items-center cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg", translateY: -20 }}
            animate={{ scale: 1, rotate: "0deg", translateY: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 md:p-8 text-center relative overflow-hidden"
            style={{ minHeight: "250px", maxHeight: "80vh" }} // Adjust the minimum and maximum height as needed
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-green-400 w-16 h-16 mx-auto mt-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-600 mt-4 md:mt-6">
              Image and location uploaded successfully
            </h3>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
