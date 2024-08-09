import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";

const ProfileBox: React.FC = () => {
  const [posts, setPosts] = useState<Repository[]>([]);
  const { data: session } = useSession();

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

  return (
    <div className="flex flex-col m-8 ">
      <div className="bg-white rounded-lg shadow-md p-4 w-80 max-w-sm">
        <div className="flex flex-col items-center">
        <Image
                        src={session?.user?.profilePic}
                        priority
                        unoptimized
                        width={50}
                        height={50}
                        alt="profile"
                        className="rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      />
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

export default ProfileBox;
