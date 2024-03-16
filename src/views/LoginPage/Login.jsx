import React, { useState, useContext } from "react";
import { HiUser, HiLockClosed } from "react-icons/hi"; 
import { Button } from "@radix-ui/themes";
import AuthContext from "../../utils/context/AuthContext";

const UserLogin = () => {
  const { loginUser, error } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    loginUser({ username, password });
  };

  return (
    <div className="flex flex-col mt-3 md:flex-row justify-center items-center min-h-screen gap-20">
      <div className="max-w-300px p-10 border border-radixgreen rounded">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          ¡Bienvenido!
        </h2>
        {error && (
          <div className="mb-2 text-red-500 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-6 relative flex items-center">
            <HiUser className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <div className="mb-6 relative flex items-center">
            <HiLockClosed className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full mt-2"
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
      <div className="w-full md:w-1/2">
        <img
          src="https://cdn2.salud180.com/sites/default/files/styles/medium/public/gym-g_0_0.jpg"
          alt="Gym image"
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
};

export default UserLogin;
