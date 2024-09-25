import { useEffect, useState } from "react";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";
import {
  deletePost,
  fetchPosts,
  likePost,
  unlikePost,
} from "../api/service/serviceApi";
import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "next-auth";

export default function Posts() {
  const [posts, setPosts] = useState<Repository[]>([]);
  const { data: session } = useSession();
  const token = session?.user?.access_token || "";
  const decodedToken = token ? jwtDecode<MyJwtPayload>(token) : null;
  const userId = decodedToken?.sub;

  useEffect(() => {
    async function getPosts() {
      if (!token) {
        console.error("No access token available");
        return;
      }

      try {
        const res = await fetchPosts(token);

        const sortedPosts = res.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }

    getPosts();
  }, [session, token]);

  const handleLikeToggle = async (postId: number, isLiked: boolean) => {
    if (!token) return;
    try {
      let updatedPost;
      if (isLiked) {
        updatedPost = await unlikePost(postId, token);
      } else {
        updatedPost = await likePost(postId, token);
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: updatedPost.likes, isLiked: !isLiked }
            : post
        )
      );
    } catch (error) {
      console.error(
        isLiked ? "Failed to unlike post:" : "Failed to like post:",
        error
      );
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId, token);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-[400px] h-[460px] mb-8 bg-white border border-gray-200 rounded-lg shadow"
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
            <div className="mt-4 ml-4">
              <p className="font-bold">
                {post.user.firstName} {post.user.lastName}
              </p>
            </div>
            {post.user.userId === userId && (
              <button
                className="text-red-500 mt-4 ml-auto mr-4"
                onClick={() => handleDelete(post.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
          <div>
            <Image
              src={post.image}
              height={0}
              width={0}
              alt={post.description}
              className="p-2 mx-auto rounded-xl w-full h-72 object-cover"
              unoptimized
            />
          </div>

          <div className="ml-2">
            <p className="font-bold">{post.likes} curtidas</p>

            <div className="flex space-x-2 mt-2 items-center">
              <button onClick={() => handleLikeToggle(post.id, post.isLiked)}>
                {post.isLiked ? (
                  <AiFillHeart size={24} color="red" />
                ) : (
                  <FiHeart size={24} color="gray" />
                )}
              </button>
            </div>

            <h5 className="mb-2 text-1xl font-bold mt-2">{post.description}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}
