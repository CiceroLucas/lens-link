import React, { useState, useRef } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode"; // Corrigi a importação
import { MyJwtPayload } from "next-auth"; // Certifique-se de que este tipo está definido corretamente
import { uploadProfilePicture } from "../api/service/serviceApi";

export default function ProfileHeader() {
  const { data: session, update } = useSession();
  const decodedToken = session?.user?.access_token
    ? jwtDecode<MyJwtPayload>(session.user.access_token)
    : null;

  const userId = decodedToken?.sub;
  const [profilePic, setProfilePic] = useState(decodedToken?.profilePic);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const newProfilePicUrl = await uploadProfilePicture(
        userId,
        file,
        session?.user.access_token
      );
      setProfilePic(newProfilePicUrl);

      // Opcional: Atualizar a sessão se necessário
      // await update(); // Dependendo de como a sessão é gerenciada
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
      alert("Falha ao atualizar a foto de perfil. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
        <div className="flex items-center justify-center sm:justify-start mb-5 relative">
          <Image
            src={profilePic} // Imagem padrão se profilePic não existir
            alt="user-avatar-image"
            className="border-4 border-solid border-white rounded-full object-cover"
            width={150}
            height={150}
            priority
            unoptimized
          />
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg"
            title="Atualizar foto de perfil"
          >
            📷
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
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
        </div>
        {isUploading && <p className="text-blue-500">Atualizando foto...</p>}
      </div>
    </section>
  );
}
