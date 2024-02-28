import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../utils/context/AuthContext'

const ProtectedRoute = () => {
    let {user} = useContext(AuthContext)
     console.log(user)
    if (!user){
        return <Navigate to="/login" />
    }
    
    return(
        <Outlet />
    )
}

export default ProtectedRoute;