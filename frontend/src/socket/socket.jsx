
import { createContext, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { io } from 'socket.io-client';
import { useAuthContext } from '../auth/context.jsx'
import './socket.css';
import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:4000" });

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);



export const SocketProvider = ({ children }) => {
    const { user } = useAuthContext();
    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user?.accessToken) return;

        if (socketRef.current) return;

        const s = io("http://localhost:4000", {
            auth: { token: user.accessToken },
        });

        socketRef.current = s;
        setSocket(s);

        s.on("test", (data) => {
            console.log("test", data);
        });

        return () => {
            s.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user?.accessToken]); // 👈 important change

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};



/*

    { curbar==="chat" && <Chat /> }
    { curbar==="contact" && <Contact /> }
    { curbar==="chatgroup" && <ChatGroup /> }
  

*/

