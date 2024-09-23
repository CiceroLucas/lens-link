import Image from "next/image";
import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading:", selectedFile);
      // Adicione aqui a lógica para fazer o upload da imagem
      onClose(); // Fecha o modal após o upload
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
      <div className="bg-white p-6 rounded-lg shadow-lg z-60 w-96 max-w-lg">
        {" "}
        {/* Aumentei o tamanho do modal */}
        <h2 className="text-lg font-bold mb-4">Upload de Imagem</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />{" "}
        {/* Somente imagens podem ser selecionadas */}
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p>
        )}{" "}
        {/* Exibe a mensagem de erro */}
        {preview && (
          <div className="relative mt-4">
            <Image
              src={preview}
              alt="Imagem Selecionada"
              className="max-w-full max-h-72 rounded-md object-cover"
            />
            <button
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
              onClick={closePreview}
            >
              X
            </button>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
