import { useEffect, useState } from "react";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { fetchPosts, likePost } from "../api/service/serviceApi"; // Importe a função likePost
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function Posts() {
  const [posts, setPosts] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set()); // Estado para gerenciar posts curtidos
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

  const toggleLike = async (postId: string) => {
    try {
      if (likedPosts.has(postId)) {
        // Caso já esteja curtido, remova do conjunto
        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = new Set(prevLikedPosts);
          newLikedPosts.delete(postId);
          return newLikedPosts;
        });
      } else {
        // Caso não esteja curtido, adicione ao conjunto
        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = new Set(prevLikedPosts);
          newLikedPosts.add(postId);
          return newLikedPosts;
        });
      }

      if (session?.user?.access_token) {
        await likePost(session.user.access_token, postId);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

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
                className="rounded-full object-cover"
                unoptimized
              />
              <div className="ml-4">
                <p className="font-semibold text-lg">
                  {post.user.firstName} {post.user.lastName}
                </p>
              </div>
            </div>

            <div className="relative w-full" style={{ height: 400 }}>
              <div className="absolute inset-0 p-2">
                <Image
                  src={post.image}
                  layout="fill"
                  objectFit="cover"
                  alt={post.description}
                  className="rounded-t-lg"
                  unoptimized
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <p className="text-gray-600 mb-2">Likes: {post.likes}</p>
              <FontAwesomeIcon
                icon={likedPosts.has(post.id) ? faHeartSolid : faHeartRegular}
                className="text-red-500 cursor-pointer"
                onClick={() => toggleLike(post.id)}
              />
            </div>

            <div className="p-4">
              <h5 className="text-xl font-bold">{post.description}</h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
