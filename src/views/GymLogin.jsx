import React, { useState } from 'react';
import './Login.css'; // Importa los estilos CSS

const GymLogin = () => {
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
    // Lógica para manejar el inicio de sesión de gimnasio...
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión como Gimnasio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default GymLogin;
