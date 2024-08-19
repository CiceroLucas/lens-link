"use client";

import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../components/Loading";
import Posts from "../components/Posts";
import ProfileBox from "../components/ProfileBox";
import SearchBox from "../components/SearchBox";

const Feed: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-4">
        <aside className="w-full md:w-1/4">
          <ProfileBox />
        </aside>
        <main className="flex-1 md:w-1/3">
          <Posts />
        </main>
        <div className="hidden md:block md:w-1/4">
          <SearchBox accessToken={session?.user.access_token || ""} />
        </div>
      </div>
    </div>
  );
};

export default Feed;
