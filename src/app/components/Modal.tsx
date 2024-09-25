import Image from "next/image";
import React, { useState, useEffect } from "react";
import { uploadPost } from "../api/service/serviceApi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

export default function Modal({ isOpen, onClose, accessToken }: ModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (selectedFile && description) {
      try {
        await uploadPost(selectedFile, description, accessToken);
        onClose();
      } catch (error) {
        setErrorMessage("Falha no upload da imagem.");
        console.error(error);
      }
    } else {
      setErrorMessage(
        "Por favor, selecione uma imagem e insira uma descrição."
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between p-2">
          <button
            className="mr-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <h2 className="text-2xl text-center font-semibold mb-6 ">
            Criar nova publicação
          </h2>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={handleUpload}
          >
            Compartilhar
          </button>
        </div>

        <div className="flex gap-8 p-2">
          <div className="flex-shrink-0">
            {preview ? (
              <div className="relative ">
                <Image
                  src={preview}
                  width={300}
                  height={350}
                  alt="Imagem Selecionada"
                  className="rounded-lg object-cover"
                />
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  onClick={closePreview}
                >
                  X
                </button>
              </div>
            ) : (
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer absolute opacity-0 w-64 h-64"
                />
                <p className="text-gray-400">Selecione uma imagem</p>
              </div>
            )}
          </div>

          <div className="flex-grow ">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da imagem..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
