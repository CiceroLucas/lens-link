import { ImagePlus, LogOut, UserRound, Home } from "lucide-react";

export const Backend_URL = "http://localhost:8000";

export const SidebarItems = [
  {
    name: "Inicio",
    path: "/",
    icon: Home,
  },
  {
    name: "Perfil",
    path: "/",
    icon: UserRound,
  },
  {
    name: "Criar",
    path: "/",
    icon: ImagePlus,
  },
];
