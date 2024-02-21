import React, { useState } from 'react';
import './App.css';
import Button from './components/Button'; // Importa el componente de botón
import Login from './views/Login'; // Importa el componente de inicio de sesión

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginButtonClick = () => {
    setShowLogin(true);
  };

  return (
    <>
    <header className="header">
        <div className="title">MuscleMate</div>
        <div className="sign-links">
          <a href="#">Sign Up</a>
          <span> | </span>
          <a href="#">Sign In</a>
        </div>
      </header>
      <h1 className="text-3xl font-bold underline mb-4">Hello world!</h1>
      <Button onClick={handleLoginButtonClick}>Iniciar Sesión</Button>
      {showLogin && <Login />} {/* Muestra el componente de inicio de sesión si showLogin es true */}
    </>
  );
}

export default App;
