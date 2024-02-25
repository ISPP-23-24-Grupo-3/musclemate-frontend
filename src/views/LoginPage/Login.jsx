import { useState, useRef, useEffect } from "react";
import loginVideo from "../../assets/other_assets/video_login.mp4"; // Importa el video de inicio de sesión
import { HiUser, HiLockClosed } from "react-icons/hi"; // Importa los iconos de usuario y candado
import MainLayout from "../MainLayout/MainLayout";
import { Button } from "@radix-ui/themes";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const videoRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    console.log(username);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    console.log(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para manejar el inicio de sesión de usuario...
  };

  useEffect(() => {
    // Reproducir el video al montar el componente
    videoRef.current.play();
  }, []);

  const handleVideoLoaded = () => {
    // Volver a reproducir el video cuando se haya cargado completamente
    videoRef.current.play();
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
      <div className="max-w-300px p-10 border border-radixgreen rounded md:mr-8">
        <h2 className="mb-6 text-radixgreen font-bold text-4xl text-center">
          ¡Bienvenido!
        </h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-6 relative flex items-center">
            <HiUser className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Usuario"
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <div className="mb-6 relative flex items-center">
            <HiLockClosed className="absolute left-0 w-8 h-8 text-radixgreen ml-4" />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Contraseña"
              className="w-full px-6 py-3 border border-radixgreen rounded-lg bg-white text-black pl-16"
            />
          </div>
          <Button
            type="submit"
            size="3"
            variant="solid"
            color="green"
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </form>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <video
          ref={videoRef}
          src={loginVideo}
          autoPlay
          loop
          muted
          onLoadedData={handleVideoLoaded}
          className="h-auto"
        >
          Tu navegador no admite la reproducción de videos.
        </video>
      </div>
    </div>
  );
};

export default UserLogin;
