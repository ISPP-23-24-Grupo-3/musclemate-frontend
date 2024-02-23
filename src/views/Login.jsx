import React, { useState, useRef, useEffect } from 'react';
import loginVideo from '../assets/other_assets/video_login.mp4'; // Importa el video de login
import { HiUser, HiLockClosed } from 'react-icons/hi'; // Importa los iconos de usuario y candado

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const videoRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
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
    <div className="flex justify-between items-center">
      <div className="max-w-300px p-10 border border-lime-500 rounded">
        <h2 className="mb-6 text-lime-500 font-bold text-4xl">¡Bienvenido!</h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-6 relative flex items-center">
            <HiUser className="absolute left-0 w-8 h-8 text-lime-500 ml-4" />
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Usuario"
              className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white text-black pl-16"
            />
          </div>
          <div className="mb-6 relative flex items-center">
            <HiLockClosed className="absolute left-0 w-8 h-8 text-lime-500 ml-4" />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Contraseña"
              className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white text-black pl-16"
            />
          </div>
          <button
            type="submit"
            className="w-full px-8 py-3 bg-lime-500 text-white border-none rounded cursor-pointer hover:bg-lime-600 font-bold"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
      <div className="w-1/2">
        <video ref={videoRef} src={loginVideo} autoPlay loop muted onLoadedData={handleVideoLoaded} className="w-full h-auto">
          Tu navegador no admite la reproducción de videos.
        </video>
      </div>
    </div>
  );
};

export default UserLogin;
