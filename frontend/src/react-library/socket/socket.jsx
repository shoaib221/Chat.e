import { io } from "socket.io-client";
import { useAuthContext } from "../auth/context";

import { createContext, useContext, useState, useEffect } from "react";


const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        if(!user) return;

        const socketInstance = io("http://localhost:4000", {
            transports: ["websocket"],
            withCredentials: true,
            auth: { token: user.accessToken }
        });

        setSocket(socketInstance);

        socketInstance.on( "test", () => console.log("test received") )

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
            setSocket(null)
        };
    }, [user]);


    return (
        <SocketContext.Provider value={{ socket }} >
            {children}
        </SocketContext.Provider>
    )
}

export const TestSocket = () => {
    const { socket } = useSocketContext();

    return (
        <div onClick={ () => socket.emit('test') } >
            Test Socket
        </div>
    )
}