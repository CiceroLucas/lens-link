import React from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

const SearchBox: React.FC = () => {
  return (
    <div className="flex flex-col m-8 ">
      <div className="bg-white rounded-lg shadow-md p-4 w-80 max-w-sm">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300 mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Nome do Usuário</h2>
          <div className="flex space-x-4">
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              aria-label="Voltar para página inicial"
            >
              <FaArrowLeft />
            </button>
            <button
              className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
              aria-label="Criar publicação"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
