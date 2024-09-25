import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Modal from "./PubModal";

import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "next-auth";

const ProfileBox: React.FC = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const token = session?.user.access_token || "";

  const decodedToken = session?.user?.access_token
    ? jwtDecode<MyJwtPayload>(session.user.access_token)
    : null;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <Image
          src={decodedToken?.profilePic}
          priority
          unoptimized
          width={100}
          height={100}
          alt="profile"
          className="rounded-full ring-2 ring-gray-300"
        />
        <div className="mt-4 text-center">
          <strong className="block text-lg font-semibold">
            {decodedToken?.firstName} {decodedToken?.lastName}
          </strong>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
        <div className="flex space-x-4 mt-4">
          <Link href="/profile">
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              aria-label="Voltar para página inicial"
            >
              <ImProfile />
            </button>
          </Link>
          <button
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
            aria-label="Criar publicação"
            onClick={openModal}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} accessToken={token} />
    </div>
  );
};

export default ProfileBox;
