
import './App.css'
import {Link} from 'react-router-dom'

function Users () {

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
            <h1 className="text-3xl font-bold underline">
                Users
            </h1>
            <Link to="/">Home</Link>
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

export default Users
  