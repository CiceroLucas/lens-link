import { Repository } from "../../types/post";

// Função para buscar posts
export async function fetchPosts(accessToken: string): Promise<Repository[]> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(
      `https://lens-link-api.onrender.com/api/v1/post`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data: Repository[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

// Função para buscar usuários por nome
export async function searchUsers(
  accessToken: string,
  query: string
): Promise<any[]> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(
      `https://lens-link-api.onrender.com/api/v1/users/search?name=${encodeURIComponent(
        query
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
}

// Função para curtir um post
export async function likePost(
  accessToken: string,
  postId: string
): Promise<void> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(
      `https://lens-link-api.onrender.com/api/v1/post/${postId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to like post:", error);
    throw error;
  }
}
