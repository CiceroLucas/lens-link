import React, { ChangeEvent, useState } from "react";
import { MyJwtPayload } from "next-auth"; // Importar a interface que você definiu
import { editUserProfile } from "../api/service/serviceApi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  userId: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  accessToken,
  userId,
}: ProfileModalProps) {
  const [firstName, setFirstName] = useState<string>(""); // Inicializando com string vazia
  const [lastName, setLastName] = useState<string>(""); // Inicializando com string vazia

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica para salvar as informações editadas
    try {
      await editUserProfile(userId, accessToken, firstName, lastName);

      onClose(); // Fechar modal após salvar
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Editar Perfil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
