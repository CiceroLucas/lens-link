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
      <div className="flex flex-col justify-between md:flex-row max-w-6xl mx-auto p-4 gap-4">
        <aside>
          <ProfileBox />
        </aside>
        <main className="flex-1">
          <Posts />
        </main>
        <div>
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default Feed;
