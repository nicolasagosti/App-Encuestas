import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext();
export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
    const login = () => setIsLogged(true);
    const logout = () => {
        localStorage.removeItem('token');
        setIsLogged(false);
    };
    return (
        <AuthCtx.Provider value={{ isLogged, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}
export const useAuth = () => useContext(AuthCtx);
