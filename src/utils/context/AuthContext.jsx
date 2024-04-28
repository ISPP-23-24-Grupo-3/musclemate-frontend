
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';


const AuthContext = createContext();

export default AuthContext;

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(
        useCallback(() =>
        (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null), [])
    )
    const [user, setUser] = useState(
        useCallback(() =>
        (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null), [])
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginUser = useCallback(async ({ username, password }) => {
        try {
            let response = await fetch(`${VITE_BACKEND_URL}/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            let data = await response.json();
            if (response.status === 200) {
                setAuthTokens(data);
                localStorage.setItem('authTokens', JSON.stringify(data));
                setUser(jwtDecode(data.access));
                if (jwtDecode(data.access).rol === 'owner') {
                    navigate('/owner/home');
                } else {
                    navigate('/');
                }
            } else {
                setError('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            setError('Se produjo un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    }, [navigate]);

    let logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/');
    }, [navigate]);


    let updateToken = async () => {
        let response = await fetch(`${VITE_BACKEND_URL}/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: authTokens?.refresh,
            }),
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
        } 
        if (response.status === 401) {
            logoutUser();
        }
        if (loading) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }
        let timeLeft = user ? user.exp * 1000 - Date.now() : 300000;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, timeLeft);
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={useMemo(() => ({ user, authTokens, loginUser, logoutUser, error }), [authTokens, error, loginUser, logoutUser, user])}>
            { loading ? null : children }
        </AuthContext.Provider>
    );
};

