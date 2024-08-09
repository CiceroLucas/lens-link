import React, { useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { searchUsers } from "../api/service/serviceApi"; // Ajuste o caminho conforme necessário
import debounce from "lodash/debounce"; // Importa a função debounce

interface SearchBoxProps {
  accessToken: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ accessToken }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cria a função de busca com debounce
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) return; // Não faça a busca se a consulta estiver vazia

      setLoading(true);
      setError(null);

      try {
        const data = await searchUsers(accessToken, query);
        console.log("Search results:", data); // Verifique a estrutura dos dados
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300), // Define o atraso de 300ms
    [accessToken] // Dependências que causam a recriação da função debounced
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery) {
      debouncedSearch(newQuery); // Chama a função debounced quando o valor muda
    } else {
      setResults([]); // Limpa os resultados se a consulta estiver vazia
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md h-4/6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={handleChange}
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch
            className="text-gray-500 cursor-pointer"
            onClick={() => debouncedSearch(query)} // Adiciona busca ao clicar no ícone de pesquisa
          />
        </div>
      </div>
      {loading && <p className="mt-2 text-gray-500">Loading...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      <ul className="mt-2">
        {results.length > 0 ? (
          results.map((user) => (
            <li
              key={user.id}
              className="py-2 border-b border-gray-200 flex items-center"
            >
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span>
                {user.firstName} {user.lastName}
              </span>
            </li>
          ))
        ) : (
          <li className="py-1 text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchBox;
