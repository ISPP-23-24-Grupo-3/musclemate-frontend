import { Link } from 'react-router-dom';
import './App.css'
<<<<<<< HEAD
import {Link} from 'react-router-dom'
import Users from './Users'
import {useState, useEffect} from 'react'

function App() {

  const[user, Setuser] = useState([])
  const[showAll, SetshowAll] = useState(true)

  useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => Setuser(data))
  }, [])

  const handleShowAll = () => {
      SetshowAll(!showAll)
  }


  return (
    <>
    <header style={header}>
      <Link to="/users">Users</Link>
    </header>
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>

    <button onClick={handleShowAll}>
      {showAll ? 'Show only 1 user' : 'Show all users'}
    </button>
    <ul>
      {showAll ? user.map((user, index) => (
        <li key={index}>{user.name}</li>
      )) : <li>{user[0].name}</li>}
    </ul>
    
=======
import MainLayout from './views/MainLayout/MainLayout'
import { Button, Flex } from '@radix-ui/themes';


function App() {
  return (
    <>
    <MainLayout>
      <Flex justify="center" align="center">
        <div className="mt-6 flex items-center">
          <img src="/pwa-64x64.png" alt="Logo" className="mr-4" />
          <h1 className="text-2xl font-bold">MuscleMate</h1>
        </div>
      </Flex>
      <Flex direction="column" justify="center" align="center" >
            <Link to="/login">
              <Button size="4" variant="classic" color="green">Iniciar Sesión</Button>
            </Link>
      </Flex>
      
    </MainLayout>
>>>>>>> origin/feature/11-main-layout
    </>
  );
}

<<<<<<< HEAD
const header = {
  backgroundColor: '#f4f4f4',
  padding: '10px',
  marginBottom: '20px'
}

export default App



=======
export default App;
>>>>>>> origin/feature/11-main-layout
