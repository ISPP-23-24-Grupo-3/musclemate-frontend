import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../utils/context/AuthContext'

const OwnerRoute = () => {
    let {user} = useContext(AuthContext)

    if ( !user || user.rol !== 'owner'){
        return <Navigate to="/login" />
    }
    
    return(
        <Outlet />
    )
}

export default OwnerRoute;