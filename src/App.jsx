
import './App.css'
import MainLayout from './views/MainLayout/MainLayout'

function App() {

  return (
    <>
    <MainLayout>
      <div className="mt-6 flex items-center">
        <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
        <h1 className="text-2xl font-bold">MuscleMate</h1>
      </div>
    </MainLayout>
    </>
  )
}

export default App
