"use client";
import Image from "next/image";
import img from "../../../public/logo-login.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [errors, setErrors] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!firstName) newErrors.push("Nome é obrigatório.");
    if (!lastName) newErrors.push("Sobrenome é obrigatório.");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) newErrors.push("Email inválido.");
    if (password.length < 6)
      newErrors.push("Senha deve ter pelo menos 6 caracteres.");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const res = await fetch(
        "https://lens-link-api.onrender.com/api/v1/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        setErrors(errorData.errors || ["An unknown error occurred"]);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors(["Failed to register"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-[#333] bg-white">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full sm:px-6 py-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-3xl font-extrabold">Sign on</h3>
                <p className="text-sm mt-4 ">
                  Já possui uma conta?{" "}
                  <a
                    href="/login"
                    className="register text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Fazer login
                  </a>
                </p>
              </div>
              {errors.length > 0 && (
                <div className="mb-4">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <div>
                <label className="text-xs block mb-2">Nome</label>
                <div className="relative flex items-center">
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="nome"
                  />
                </div>
              </div>
              <div className="mt-8">
                <label className="text-xs block mb-2">Sobrenome</label>
                <div className="relative flex items-center">
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="sobrenome"
                  />
                </div>
              </div>
              <div className="mt-8">
                <label className="text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="email"
                  />
                </div>
              </div>
              <div className="mt-8">
                <label className="text-xs block mb-2">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm border-b border-gray-300 focus:border-[#333] px-2 py-3 outline-none"
                    placeholder="password"
                  />
                </div>
              </div>
              <div className="mt-12">
                <button
                  type="submit"
                  className="button w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded-full text-white hover:bg-blue-700 focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Criar conta"}
                </button>
              </div>
            </form>
          </div>

          <div className="md:h-full text-white max-md:mt-10 bg-[#264ECA] rounded-xl lg:p-12 p-8">
            <h1 className="text-4xl">
              Bem vindo ao
              <br /> lens link.
            </h1>
            <p>Faça login para acessar sua conta</p>
            <Image
              src={img}
              priority={true}
              width={470}
              height={470}
              alt="Logo Login"
              unoptimized
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
