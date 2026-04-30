import { useState } from "react"
import './home.css'
import { Friends } from "./friends"
import { Users } from "./users"
import { SentRequests } from "./sentRequests"
import { FriendRequests } from "./friendrequests"
import { PrivateRoute } from "@/react-library/auth/RestrictedRoutes"
import { Groups } from "../group/groups"

export function Home() {
    const [board, setBoard] = useState("friends")
    

    return (
        <PrivateRoute>
            <div>

                <div className="flex gap-4 p-4 mx-auto justify-center my-4 overflow-auto" >
                    <div className={`option ${board === 'friends' && 'selected'}`} onClick={() => setBoard('friends')} > Friends </div>

                    <div className={`option ${board === 'frequests' && 'selected'}`} onClick={() => setBoard('frequests')} > Friend Requests </div>
                    <div className={`option ${board === 'srequests' && 'selected'}`} onClick={() => setBoard('srequests')} > Sent Requests </div>
                    <div className={`option ${board === 'users' && 'selected'}`} onClick={() => setBoard('users')} > Find Users </div>
                    <div className={`option ${board === 'groups' && 'selected'}`} onClick={() => setBoard('groups')} > Groups </div>

                </div>

                {board === 'friends' && <Friends />}
                {board === 'users' && <Users />}
                {board === 'srequests' && <SentRequests />}
                {board === 'frequests' && <FriendRequests />}
                {board === 'groups' && <Groups />}

            </div>
        </PrivateRoute>
    )
}