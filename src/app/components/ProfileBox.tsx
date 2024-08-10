import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Modal from "./Modal";
import { Repository } from "../types/post";

const ProfileBox: React.FC = () => {
  const [posts, setPosts] = useState<Repository[]>([]);
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getPosts() {
      if (!session?.user?.access_token) {
        console.error("No access token available");
        return;
      }

      try {
        const response = await fetch(
          `https://lens-link-api.onrender.com/api/v1/post`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const res = await response.json();
        setPosts(res);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }

    getPosts();
  }, [session]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <Image
          src={session?.user?.profilePic || "/default-profile.png"}
          priority
          unoptimized
          width={100}
          height={100}
          alt="profile"
          className="rounded-full ring-2 ring-gray-300"
        />
        <div className="mt-4 text-center">
          <strong className="block text-lg font-semibold">
            {session?.user?.firstName} {session?.user?.lastName}
          </strong>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            aria-label="Voltar para página inicial"
          >
            <ImProfile />
          </button>
          <button
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
            aria-label="Criar publicação"
            onClick={openModal}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ProfileBox;
