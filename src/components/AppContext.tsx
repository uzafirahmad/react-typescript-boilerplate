import React, { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom"; 

interface AppContextType {
    test: string;
    user: any; // Replace any with the actual type for your user data
    logoutUser: () => void;
    loginUser: (token: string) => void; // Replace with actual arguments if needed
}

const AppContext = createContext<AppContextType>({
    test: "defaultTest",
    user: null, // Replace null with a default value if necessary
    logoutUser: () => { }, // No-op function as default
    loginUser: (token: string) => { }, // No-op function as default
});

export default AppContext;

export const Provider = ({ children }: { children: ReactNode }) => {
    let [loginloader, setLoginloader] = useState(false);
    const backendRoot = ''

    const navigate = useNavigate();
    let [authTokens, setAuthTokens] = useState(() => {
        const tokenString = localStorage.getItem("authTokens");
        return tokenString ? JSON.parse(tokenString) : null;
    });

    let [user, setUser] = useState(() => {
        const tokenString = localStorage.getItem("authTokens");
        return tokenString ? jwtDecode(tokenString) : null;
      });
      

    let loginUser = async (e:any) => {
        if (loginloader == false) {
            setLoginloader(true);
            e.preventDefault();
            let response = await fetch(`${backendRoot}/auth/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: e.target.email.value,
                    password: e.target.password.value,
                }),
            });
            let data = await response.json();

            if (response.status === 200) {
                setLoginloader(false);
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/");
            } else {
                setLoginloader(false);
                alert("incorrect credentials");
            }
        }
    };

    let updateToken = async () => {
        let response = await fetch(`${backendRoot}/auth/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: authTokens.refresh }),
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
        } else {
            logoutUser();
            navigate("/login");
        }
    };

    useEffect(() => {
        let minutes = 1000 * 60 * 4;
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, minutes);
        return () => clearInterval(interval);
    }, [authTokens]);

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        alert("Logout Successful");
    };

    let contextData = {
        test: "user123",
        user: user,
        logoutUser: logoutUser,
        loginUser: loginUser,
    };

    return (
        <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
    );
};