

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useAuthContext } from '../auth/context.jsx'


export const PageNotFound = () => {
    const navigate = useNavigate();
    const {user}  = useAuthContext();

    return (
        <div>
            404 Page Not Found
            
        </div>
    )
}

