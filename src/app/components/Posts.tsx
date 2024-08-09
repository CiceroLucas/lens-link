import { useEffect, useState } from "react";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { fetchPosts } from "../api/service/serviceApi";

export default function Posts() {
  const [posts, setPosts] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function getPosts() {
      if (!session?.user?.access_token) {
        setError("No access token available");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchPosts(session.user.access_token);
        setPosts(res);
      } catch (error) {
        setError("Failed to fetch posts.");
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, [session]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center px-4">
      {posts.length === 0 ? (
        <div className="text-center py-4">No posts available</div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="max-w-xl w-full bg-white border border-gray-200 rounded-lg shadow-md mb-8"
          >
            <div className="flex items-center p-4">
              <Image
                src={post.user.profilePic}
                height={40}
                width={40}
                alt={`${post.user.firstName}'s profile picture`}
                className="rounded-full"
                unoptimized
              />
              <div className="ml-4">
                <p className="font-semibold text-lg">
                  {post.user.firstName} {post.user.lastName}
                </p>
              </div>
            </div>

            <Image
              src={post.image}
              height={400}
              width={400}
              alt={post.description}
              className="w-full h-auto object-cover rounded-t-lg"
              unoptimized
            />

            <div className="p-4">
              <p className="text-gray-600 mb-2">Likes: {post.likes}</p>
              <h5 className="text-xl font-bold">{post.description}</h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
