
import './App.css'
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
    
    </>
  )
}

const header = {
  backgroundColor: '#f4f4f4',
  padding: '10px',
  marginBottom: '20px'
}

export default App



