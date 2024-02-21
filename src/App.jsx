import React, { useState } from 'react';
import './App.css';
import UserLogin from './views/UserLogin'; // Importa el componente de inicio de sesión de usuario
import GymLogin from './views/GymLogin'; // Importa el componente de inicio de sesión de gimnasio

function App() {
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showGymLogin, setShowGymLogin] = useState(false);

  const handleUserLoginButtonClick = () => {
    setShowUserLogin(true);
    setShowGymLogin(false); // Asegúrate de ocultar el otro componente si se muestra
  };

  const handleGymLoginButtonClick = () => {
    setShowGymLogin(true);
    setShowUserLogin(false); // Asegúrate de ocultar el otro componente si se muestra
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={handleUserLoginButtonClick}>Soy un Usuario</button>
      <button onClick={handleGymLoginButtonClick}>Soy un Gimnasio</button>
      {showUserLogin && <UserLogin />} {/* Muestra el componente de inicio de sesión de usuario si showUserLogin es true */}
      {showGymLogin && <GymLogin />} {/* Muestra el componente de inicio de sesión de gimnasio si showGymLogin es true */}
    </>
  );
}

export default App;
