import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox: React.FC = () => {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
