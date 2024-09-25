import { useEffect, useState } from "react";
import { fetchPostsByUserId } from "../api/service/serviceApi";
import { Repository } from "../types/post";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function UserPosts() {
  const [posts, setPosts] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user?.access_token || "";

  const decodedToken = token ? jwtDecode<MyJwtPayload>(token) : null;
  const userId = decodedToken?.sub;

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (!userId) throw new Error("User ID not available");
        const fetchedPosts = await fetchPostsByUserId(userId, token);

        const sortedPosts = fetchedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(sortedPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      getPosts();
    }
  }, [userId, token]);

  if (loading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white rounded-md shadow mt-10 ml-10 mr-10">
      <div className="py-2 text-center mt-5">
        <FontAwesomeIcon
          className="text-center text-4xl text-gray"
          icon={faImage}
        />
      </div>
      <div className="md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="p-6 mb-6 transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer"
            >
              <Link
                href={post.image}
                className="absolute opacity-0 top-0 right-0 left-0 bottom-0"
                target="_blank"
                rel="noopener noreferrer"
              />
              <div className="relative mb-4 rounded-2xl">
                <Image
                  width={400}
                  height={400}
                  className="max-h-80 rounded-2xl w-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                  src={post.image}
                  alt={post.description}
                  unoptimized
                  style={{ height: "300px", width: "410px" }}
                />
                <Link
                  className="flex justify-center items-center bg-blue-500 bg-opacity-80 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                  href={post.image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver imagen
                </Link>
              </div>
              <h3 className="font-medium text-xl leading-8 text-center">
                <span dangerouslySetInnerHTML={{ __html: post.description }} />
              </h3>
            </article>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}
