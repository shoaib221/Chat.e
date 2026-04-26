import { useState } from "react"
import './home.css'
import { Friends } from "./friends"
import { Users } from "./users"
import { SentRequests } from "./sentRequests"
import { FriendRequests } from "./friendrequests"

export function Home () {
    const [board, setBoard] = useState( "friends" )

    return (
        <div>

            <div className="flex gap-2 p-2" >
                <div className={ `option ${ board === 'friends' && 'selected' }` } onClick={ () => setBoard('friends') } > Friends </div>
                <div className={ `option ${ board === 'groups' && 'selected' }` } onClick={ () => setBoard('groups') } > Groups </div>
                <div className={ `option ${ board === 'frequests' && 'selected' }` } onClick={ () => setBoard('frequests') } > Friend Requests </div>
                <div className={ `option ${ board === 'srequests' && 'selected' }` } onClick={ () => setBoard('srequests') } > Sent Requests </div>
                <div className={ `option ${ board === 'users' && 'selected' }` } onClick={ () => setBoard('users') } > Find Users </div>

            </div>

            { board === 'friends' && <Friends /> }
            { board === 'users' && <Users /> }
            { board === 'srequests' && <SentRequests /> }
            { board === 'frequests' && <FriendRequests /> }

        </div>
    )
}