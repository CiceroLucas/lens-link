"use client";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import UserPosts from "../components/ProfilePosts";

export default function Profile() {
  return (
    <>
      <Navbar />
      <ProfileHeader />
      <UserPosts />
    </>
  );
}
