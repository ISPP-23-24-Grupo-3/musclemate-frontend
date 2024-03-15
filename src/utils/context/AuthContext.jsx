/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const AuthProvider = () => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (e )=> {
        e.preventDefault()
        let response = await fetch(`${VITE_BACKEND_URL}/token/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'username': e.target.username.value,
                'password': e.target.password.value
            })
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
            setUser(jwtDecode(data.access))
            
            
        }else{
            
            alert('Something went wrong!')
        }

        if (jwtDecode(data.access).rol === 'owner'){
            navigate('/owner/home')
        }else{
            navigate('/')
        }
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

    let updateToken = async ()=> {

        let response = await fetch(`${VITE_BACKEND_URL}/token/refresh/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'refresh': authTokens?.refresh
            })
        })

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {

        if(loading){
            updateToken()
        }


        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : <Outlet />}
        </AuthContext.Provider>
    )
}
