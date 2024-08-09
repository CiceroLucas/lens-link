import { Repository } from "../types/post";

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
