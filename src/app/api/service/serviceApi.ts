import { Repository } from "../../types/post";

const BACKEND_URL = "https://lens-link-api.onrender.com/api";

// Função para buscar posts
export async function fetchPosts(accessToken: string): Promise<Repository[]> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/v1/post`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
      `${BACKEND_URL}/v1/users/search?name=${encodeURIComponent(query)}`,
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

export async function fetchPostsByUserId(
  userId: string,
  accessToken: string
): Promise<Repository[]> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/v1/users/${userId}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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

export async function editUserProfile(
  userId: string,
  accessToken: string,
  firstName: string,
  lastName: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  console.log("Form submitted with values:", { firstName, lastName });

  try {
    const response = await fetch(`${BACKEND_URL}/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName }), // Corpo da requisição com o nome e sobrenome
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json(); // Retorna os dados do perfil atualizado
  } catch (error) {
    console.error("Failed to edit user profile:", error);
    throw error;
  }
}

// Função para curtir um post
export const likePost = async (postId: number, token: string) => {
  const response = await fetch(`${BACKEND_URL}/v1/post/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  return await response.json();
};

export const unlikePost = async (postId: number, token: string) => {
  const response = await fetch(`${BACKEND_URL}/v1/post/${postId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to unlike post");
  }

  return await response.json();
};

export async function uploadPost(
  file: File,
  description: string,
  token: string
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  const response = await fetch(`${BACKEND_URL}/v1/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload post image");
  }

  return await response.json();
}

export async function deletePost(postId: number, token: string) {
  const response = await fetch(`${BACKEND_URL}/v1/post/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
}

export async function uploadProfilePicture(
  userId: string,
  file: File,
  accessToken: string
): Promise<string> {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  const formData = new FormData();
  formData.append("profile", file); // O nome do campo deve corresponder ao esperado pelo backend

  try {
    const response = await fetch(`${BACKEND_URL}/v1/users/${userId}/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type" NÃO deve ser definido quando se usa FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload profile picture");
    }

    const data = await response.json();
    return data.profilePic; // Supondo que a resposta contenha a URL da nova foto
  } catch (error) {
    console.error("Failed to upload profile picture:", error);
    throw error;
  }
}