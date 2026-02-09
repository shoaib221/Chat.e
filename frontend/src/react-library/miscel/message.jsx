import { useAuthContext } from "../auth/context";
import "./message.css";


export const Message1 = ( { message } ) => {
    const { user } = useAuthContext();

    console.log(user);

    return (
        <div className={`${ message.receiver === user.username ? "received" : "sent" } w-[70%] p-2 rounded-lg my-2`} >
            { message.text && <p>{message.text}</p> } 

            { message.audio && <audio  controls>
                <source src={message.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio> }

            { message.video && <video  controls>
                <source src={message.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video> }

            { message.image && <img src={message.image}  alt="message image" /> }        
            
        </div>
    )
}