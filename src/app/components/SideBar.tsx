import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  MoreVertical,
  ChevronLast,
  ChevronFirst,
  Home,
  HomeIcon,
  LogOut,
} from "lucide-react";
import { useContext, createContext, useState } from "react";
import Link from "next/link";
import { SidebarItems } from "../constants";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const route = useRouter();

  async function logout() {
    await signOut({
      redirect: false,
    });
    route.replace("/");
  }

  return (
    <div className="">
      <aside className="sidebar">
        <div className="sidebar_top">
          <Image
            src={session?.user.profilePic}
            width={80}
            height={80}
            alt="profile"
            className="sidebar_logo"
          />
          <p className="sidebar_logo-name">
            {session?.user.firstName} {session?.user.lastName}
          </p>
        </div>
        <ul className="sidebar_list">
          {SidebarItems.map(({ name, path, icon: Icon }) => (
            <li className="sidebar_item" key={name}>
              <Link href="/" className="sidebar_link">
                <span className="sidebar_icon">
                  <Icon />
                </span>
                <span className="sidebar_name">{name}</span>
              </Link>
            </li>
          ))}
          <li className="sidebar_item">
            <Link href={""} className="sidebar_link" onClick={logout}>
              <span className="sidebar_icon">
                <LogOut />
              </span>
              <span className="sidebar_name">Sair</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
