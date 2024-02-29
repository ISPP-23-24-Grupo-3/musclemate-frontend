import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../utils/context/AuthContext'

const UserRoute = () => {
    let {user} = useContext(AuthContext)

    if (user.rol !== 'user'){
        return <Navigate to="/login" />
    }
    
    return(
        <Outlet />
    )
}

export default UserRoute;