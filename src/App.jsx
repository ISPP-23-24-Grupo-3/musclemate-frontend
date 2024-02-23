import { Link } from 'react-router-dom';
import './App.css'
import MainLayout from './views/MainLayout/MainLayout'


function App() {
  return (
    <>
    <MainLayout>
      <div className="mt-6 flex items-center">
        <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
        <h1 className="text-2xl font-bold">MuscleMate</h1>
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
      </div>
    </MainLayout>
    </>
  );
}

export default App;
