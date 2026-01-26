const { createContext, useContext, useState } = require("react");


const SocketContext = createContext();

export const useSocketContext = () => useContext( SocketContext );

export const SocketProvider = ( { children } ) => {
    const [ socket, setSocket ] = useState(null);


    return (
        <SocketContext.Provider value={{ socket }} >
            { children }
        </SocketContext.Provider>
    )
}