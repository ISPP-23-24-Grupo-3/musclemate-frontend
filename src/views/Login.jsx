import React, { useState, useRef, useEffect } from 'react';
import loginVideo from '../assets/other_assets/video_login.mp4'; // Importa el video de login

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
        <h2 className="mb-6 text-lime-500 font-bold text-4xl">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mb-6 relative">
            <label className="absolute left-0 w-24 bg-lime-500 h-full flex justify-center items-center text-white rounded-l-lg">Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white text-black pl-28"
            />
          </div>
          <div className="mb-6 relative">
            <label className="absolute left-0 w-24 bg-lime-500 h-full flex justify-center items-center text-white rounded-l-lg">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white text-black pl-28"
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