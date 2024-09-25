import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "next-auth";
import ProfileModal from "./ProfileModal";

export default function ProfileHeader() {
  const { data: session } = useSession();
  const decodedToken = session?.user?.access_token
    ? jwtDecode<MyJwtPayload>(session.user.access_token)
    : null;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="relative bg-white rounded-md shadow ml-10 mr-10">
      {/* Wallpaper do header */}
      <div className="relative h-65 w-full overflow-hidden">
        <Image
          src="https://zavxbzloccalzprhjzkt.supabase.co/storage/v1/object/public/lenslink/Vector.png"
          alt="cover-image"
          className="w-full h-full object-cover"
          width={0}
          height={0}
          unoptimized
        />
      </div>

      {/* Conteúdo do header */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-[-75px] mb-10 relative z-10">
        <div className="flex items-center justify-center sm:justify-start mb-5">
          <Image
            src={decodedToken?.profilePic}
            alt="user-avatar-image"
            className="border-4 border-solid border-white rounded-full object-cover"
            width={150}
            height={150}
            priority
            unoptimized
          />
        </div>
        <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
          <div className="block">
            <h3 className="font-manrope font-bold text-4xl text-gray-900 mb-1">
              {decodedToken?.firstName} {decodedToken?.lastName}
            </h3>
            <p className="font-normal text-base leading-7 text-gray-500">
              {decodedToken?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="py-3.5 px-5 rounded-full bg-indigo-500 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userProfile={decodedToken}
      />
    </section>
  );
}
