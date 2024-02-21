import React, { useState } from 'react';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="max-w-300px mx-auto p-10 border border-lime-500 rounded">
      <h2 className="mb-10 text-lime-500">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="relative">
        <div className="mb-10 relative">
          <label className="absolute left-0 w-24 bg-lime-500 h-full flex justify-center items-center text-white rounded-l-lg">Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white"
          />
        </div>
        <div className="mb-10 relative">
          <label className="absolute left-0 w-24 bg-lime-500 h-full flex justify-center items-center text-white rounded-l-lg">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-6 py-3 border border-lime-500 rounded-r-lg bg-white"
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
  );
};

export default UserLogin;
