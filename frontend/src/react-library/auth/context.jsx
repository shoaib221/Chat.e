import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "./firebase.config";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

const baseURL = "http://localhost:4000";
// const baseURL = "https://express-practice-chi.vercel.app/";


const axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});


const axiosFormData = axios.create({
    baseURL,
    headers: { "Content-Type": "multipart/form-data" },
});




export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    
    const interceptors = useRef({ req: null, res: null });

    
    const LogOut = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
            })
            .catch((error) => toast.error(error.message));
    };

    
    const setupInterceptors = (firebaseUser) => {
        
        if (interceptors.current.req !== null) {
            axiosInstance.interceptors.request.eject(interceptors.current.req);
            axiosInstance.interceptors.response.eject(interceptors.current.res);
            
        }

        
        interceptors.current.req = axiosInstance.interceptors.request.use(
            (config) => {
                if (firebaseUser?.accessToken) {
                    config.headers.authorization = `Bearer ${firebaseUser.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        
        interceptors.current.res = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (
                    error.response &&
                    (error.response.status === 401 || error.response.status === 403)
                ) {
                    LogOut();
                    navigate("/auth");
                }
                return Promise.reject(error);
            }
        );

        axiosFormData.interceptors.request.use(
            (config) => {
                if (firebaseUser?.accessToken) {
                    config.headers.authorization = `Bearer ${firebaseUser.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        
        axiosFormData.interceptors.response.use(
            (response) => response,
            (error) => {
                if (
                    error.response &&
                    (error.response.status === 401 || error.response.status === 403)
                ) {
                    LogOut();
                    navigate("/auth");
                }
                return Promise.reject(error);
            }
        );

    };

    
    const handleUserLogin = async (firebaseUser) => {
        console.log("handle user login")
        if (!firebaseUser) {
            
            setUser(null);
            setLoading(false);
            return;
        }

        
        setupInterceptors(firebaseUser);

        console.log(firebaseUser);

        try {
            
            const res = await axiosInstance.post("/auth/fb-register", firebaseUser);

            const fullUser = {
                ...firebaseUser,
                ...res.data.user, 
            };

            

            setUser(fullUser);
        } catch (err) {
            console.error(err);
            
            setUser(firebaseUser); 
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setLoading(true);
            handleUserLogin(firebaseUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const value = {
        user,
        loading,
        LogOut,
        axiosInstance,
        axiosFormData,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
