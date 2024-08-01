"use client";
import { useSession } from "next-auth/react";
import Login from "./login/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./components/Loading";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/feed");
    }
  }, [session, router]);

  return <>{!session && <Login />}</>;
}
