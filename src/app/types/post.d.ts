export type Repository = {
  id: number;
  image: string;
  description: string;
  likes: number;
  createdAt: string;
  user: {
    profilePic: string;
    firstName: string;
    lastName: string;
    userId: string;
  };
  comments: [];
  isLiked: boolean;
};
