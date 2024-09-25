"use client";
import Image from "next/image";
import img from "../../../public/logo-login.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/feed");
  };

  return (
    <div className="text-[#333] bg-white">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full sm:px-6 py-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-3xl font-extrabold">Login</h3>
                <p className="text-sm mt-4 ">
                  Não possui uma conta?{" "}
                  <a
                    href="/register"
                    className="register text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Criar conta
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
                <label className="text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
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
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>

          <div className="md:h-full text-white max-md:mt-10 bg-[#0099FF] rounded-xl lg:p-12 p-8">
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
              alt=""
              unoptimized
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
