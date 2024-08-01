export type Repository = {
  id: string;
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
};
