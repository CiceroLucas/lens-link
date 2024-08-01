import { useEffect, useState } from "react";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Posts() {
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
    <div className="flex flex-col justify-center items-center">
      {posts.map((post) => (
        <div
          key={post.id}
          className="max-w-sm mt-8 bg-white border border-gray-200 rounded-lg shadow"
        >
          <div className="flex items-center">
            <Image
              src={post.user.profilePic}
              height={40}
              width={40}
              alt={post.description}
              className="mt-5 ml-2 rounded-full"
              unoptimized
            />
            <div className="mt-4 ml-4   ">
              <p className="font-bold">
                {post.user.firstName} {post.user.lastName}
              </p>
            </div>
          </div>

          <Image
            src={post.image}
            height={400}
            width={400}
            alt={post.description}
            className="p-2 mx-auto mt-4 rounded-xl"
            unoptimized
          />

          <div className="ml-2">
            <p>likes: {post.likes}</p>

            <br></br>
            <h5 className="mb-2 text-1xl font-bold ">{post.description}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}
