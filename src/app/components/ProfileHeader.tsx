import Image from "next/image";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "next-auth";

export default function ProfileHeader() {
  const { data: session } = useSession();
  const decodedToken = session?.user?.access_token
    ? jwtDecode<MyJwtPayload>(session.user.access_token)
    : null;

  return (
    <section className="bg-white rounded-md shadow ml-10 mr-10">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-10 mb-10">
        <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
          <Image
            src={decodedToken?.profilePic}
            alt="user-avatar-image"
            className="border-4 border-solid border-white rounded-full object-cover"
            width={150}
            height={150}
            priority
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
        <div className="flex flex-col lg:flex-row max-lg:gap-5 items-center justify-between py-0.5">
          <div className="flex items-center gap-4">
            <button className="py-3.5 px-5 rounded-full bg-indigo-600 text-white font-semibold text-base leading-7 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700">
              Edit Profile
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 ">
            <p className="flex items-center gap-2 font-medium text-lg leading-8 text-gray-400">
              Publicações
            </p>
            <ul className="flex items-center max-sm:justify-center max-sm:flex-wrap gap-2.5">
              <li className="py-3.5 px-7 rounded-full bg-orange-50 font-semibold text-base leading-7 text-orange-600">
                0
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
