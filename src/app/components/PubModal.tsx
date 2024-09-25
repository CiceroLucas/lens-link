import Image from "next/image";
import React, { useState, useEffect } from "react";
import { uploadPost } from "../api/service/serviceApi";
import { FaTimes, FaUpload } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

const MAX_DESCRIPTION_LENGTH = 50; // Atualizado para 200 caracteres

export default function Modal({ isOpen, onClose, accessToken }: ModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setErrorMessage(null);
      } else {
        setErrorMessage("Por favor, selecione um arquivo de imagem.");
      }
    }
  };

  const handleUpload = async () => {
    if (
      selectedFile &&
      description.length > 0 &&
      description.length <= MAX_DESCRIPTION_LENGTH
    ) {
      setIsUploading(true);
      try {
        await uploadPost(selectedFile, description, accessToken);
        onClose();
      } catch (error) {
        setErrorMessage("Falha no upload da imagem.");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage(
        "Por favor, selecione uma imagem e insira uma descrição válida (até 200 caracteres)."
      );
    }
  };

  const closePreview = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 sm:mx-0">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Criar Nova Publicação
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Seção de Imagem */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            {preview ? (
              <div className="relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto">
                  <Image
                    src={preview}
                    width={160} // 40px * 4 para melhor qualidade em telas de alta resolução
                    height={160}
                    alt="Imagem Selecionada"
                    className="rounded-md object-cover shadow-md"
                  />
                </div>
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  onClick={closePreview}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition">
                <FaUpload size={24} className="text-gray-500 mb-2" />
                <span className="text-gray-500">
                  Clique ou arraste a imagem aqui
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Seção de Descrição */}
          <div className="flex-grow">
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Digite a descrição da imagem..."
              className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <p className="text-right text-sm text-gray-500">
              {description.length} / {MAX_DESCRIPTION_LENGTH} caracteres
            </p>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end items-center border-t p-4 space-x-3">
          <button
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading && (
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
