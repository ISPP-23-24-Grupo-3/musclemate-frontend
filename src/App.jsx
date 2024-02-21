import React, { useState } from 'react';
import './App.css';
import Login from './views/Login'; // Importa el componente de inicio de sesión desde la carpeta views

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginButtonClick = () => {
    setShowLogin(true);
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={handleLoginButtonClick}>Iniciar Sesión</button>
      {showLogin && <Login />} {/* Muestra la vista de inicio de sesión si showLogin es true */}
    </>
  );
}

export default App;
