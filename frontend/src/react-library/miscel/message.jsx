import { useAuthContext } from "../auth/context";
import "./message.css";


export const Message1 = ( { message, partner } ) => {
    const { user } = useAuthContext();

    return (
        <div className={`${ message.receiver === user.username ? "received" : "sent" } max-w-[70%] p-2 rounded-full my-2 flex gap-2`} >
            <div className="h-8 w-8 min-w-8 rounded-full bg-cover bg-top" style={{ backgroundImage: `url(${ message.receiver === user.username ? partner.photo : user.photo })` }} ></div>

            { message.text && <p className="bg-(--color1) px-4 py-1 rounded-lg" >{message.text}</p> } 

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