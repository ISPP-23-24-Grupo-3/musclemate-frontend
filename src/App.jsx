import React from 'react';
import './App.css';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

function App() {
  return (
    <>
      <header className="header">
        <div className="title text-black">MuscleMate</div>
        <div className="sign-links">
          <Link to="/signup">Sign Up</Link> {/* Utiliza Link en lugar de a para la navegación */}
          <span className="text-black font-semibold"> | </span>
          <Link to="/login">Sign In</Link> {/* Utiliza Link en lugar de a para la navegación */}
        </div>
      </header>
      <h1 className="text-3xl font-bold underline mb-4 text-black">Hello world!</h1>
      <Link to="/login">
        <button>Iniciar Sesión</button>
      </Link>
    </>
  );
}

export default App;
