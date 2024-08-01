import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      sub: string | null | undefined;
      firstName: string | null | undefined;
      lastName: string;
      email: string | null | undefined;
      profilePic: any;
      access_token: string;
    };
  }

  interface User {
    access_token: string;
  }
}
