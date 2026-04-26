

import { useAuthContext } from "@/react-library/auth/context";
import { useSocketContext } from "@/react-library/socket/socket";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegSmile } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { LuAudioLines } from "react-icons/lu";
import { Message1 } from "@/react-library/miscel/message";
import './chat.css';
import { PrivateRoute } from "@/react-library/auth/RestrictedRoutes";
import { useParams } from "react-router-dom";




const Users = (props) => {
    const [users, setUsers] = useState(null);
    const { user, axiosInstance } = useAuthContext();
    const { onlineUsers } = useSocketContext();

    async function FetchUsers() {
        try {
            let res = await axiosInstance.get('/chat/fetch-users');
            setUsers(res.data.users);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        if (!user) return;

        FetchUsers();

    }, [user])

    return (
        <div className="lg:flex flex-col min-w-80 gap-2 p-2 hidden"  >
            {users && users.map(elem => <p onClick={() => props.setPartner(elem)} className={`${elem?.username === props?.partner?.username ? "bg-(--color1a)" : ""} cursor-pointer hover:bg-(--color1a) flex items-center gap-2 p-2 rounded-lg`} >
                <div className={`h-6 w-6 rounded-full bg-cover bg-top`} style={{ backgroundImage: `url(${elem.photo})` }} ></div> {elem.name}
                {onlineUsers[elem.username] && <span className="h-2 w-2 bg-green-400 rounded-full"></span>}
            </p>)}
        </div>
    )
}


const useSmallUsers = (props) => {
    const [users, setUsers] = useState(null);
    const { user, axiosInstance } = useAuthContext();
    const { onlineUsers } = useSocketContext();
    const [open, setOpen] = useState(false);

    async function FetchUsers() {
        try {
            let res = await axiosInstance.get('/chat/fetch-users');
            setUsers(res.data.users);
        } catch (err) {
            console.log(err.message);
        }
    }

    function Toggle() {
        setOpen(prev => !prev)
    }

    function SelectPartner(elem) {
        props.setPartner(elem)
        setOpen(false)

    }

    useEffect(() => {
        if (!user) return;

        FetchUsers();

    }, [user])

    const Tag = () => (
        <div className={`${open ? 'open' : ""} sidebar  bg-(--color1)`}  >

            <div className="absolute top-0 left-0 right-0 h-10 bg-red-800 text-white text-center" onClick={() => setOpen(false)} >Close</div>
            <div className="h-10" ></div>

            {users && users.map(elem => <p onClick={() => SelectPartner(elem)} className={`${elem?.username === props?.partner?.username ? "bg-(--color1a)" : ""} cursor-pointer hover:bg-(--color1a) flex items-center gap-2 p-2 rounded-lg`} >
                <div className={`h-6 w-6 rounded-full bg-cover bg-top`} style={{ backgroundImage: `url(${elem.photo})` }} ></div> {elem.name}
                {onlineUsers[elem.username] && <span className="h-2 w-2 bg-green-400 rounded-full"></span>}
            </p>)}


        </div>
    )

    return { Tag, Toggle }
}

import { uploadToCloudinary } from "@/react-library/Media/cloudinary_upload";
import { Loading } from "@/react-library/miscel/Loading";
import { NotFound } from "@/react-library/miscel/NotFound";


export const Chat = () => {
    const [messages, setMessages] = useState(null);
    const { user, axiosInstance, axiosFormData } = useAuthContext();
    const { socket, onlineUsers } = useSocketContext();
    const { register, reset, handleSubmit, watch } = useForm();
    const { id } = useParams()
    const [partner, setPartner] = useState(null)
    const [loading, setLoading] = useState(true)

    let image = watch("image");
    let video = watch("video");
    let audio = watch("audio");


    async function FetchMessage() {
        setLoading(true)
        try {
            let res = await axiosInstance.post('/chat/fetch-message', { id });
            setMessages(res.data.messages);
            setPartner( res.data.partner );
            console.log( res.data )
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            console.log("message received:", data, partner);
            if (partner.username !== data.messages[0].sender) return;



            setMessages(prevnew_messages => {

                let new_messages = prevnew_messages;
                new_messages = new_messages.concat(data.messages);
                return new_messages;
            });
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };

    }, [socket]);



    useEffect(() => {
        if (!user || !id) return;

        FetchMessage();

    }, [id, user]);


    async function SendMessage(data) {
        try {

            let new_messages = []



            if (data.image?.length > 0) {
                for (const elem of Array.from(data.image)) {
                    const content = await uploadToCloudinary(elem, "image");

                    new_messages.push({ content, type: "image" })
                }
            }

            if (data.video?.length > 0) {
                for (const elem of Array.from(data.video)) {
                    const content = await uploadToCloudinary(elem, "video");

                    new_messages.push({ content, type: "video" })
                }
            }

            if (data.audio?.length > 0) {
                for (const elem of Array.from(data.audio)) {
                    const content = await uploadToCloudinary(elem, "audio");
                    new_messages.push({ content, type: "audio" })
                }
            }



            if(data.text) new_messages.push({ type: "text", content: data.text })

            console.log(new_messages)



            let res = await axiosInstance.post('/chat/send-message', { receiver: partner.username, messages: new_messages });



            new_messages = messages;
            new_messages = new_messages.concat(res.data.messages);

            

            setMessages(new_messages);
            reset();

        } catch (err) {
            console.log(err);
            alert('error')
        }
    }

    if( loading ) return <Loading />

    if( !partner || !messages) return <NotFound />

    return (
        <div className="relative h-[calc(100vh-60px)] grow bg-(--color1a)" >
            <div className="h-10 absolute p-2 top-0 left-0 right-0 bg-(--color1) flex z-10 gap-4 items-center  justify-between" >
                {partner.name} {onlineUsers[partner.username] ? <div className="h-2 w-2 rounded-full bg-green-400" ></div> : ""}


                
            </div>

            <div className="overflow-auto pt-12 pb-24 max-h-[calc(100vh-60px)] bg-(--color1a) p-4 flex flex-col" >
                {messages && messages.map(elem => <Message1 message={elem} key={elem._id} partner={partner} />)}
            </div>

            <div className="h-24 absolute bottom-0 left-0 right-0 bg-(--color1) z-10" >
                <form onSubmit={handleSubmit(SendMessage)} className="flex gap-4 p-4 items-center absolute inset-0" >

                    <div className="rounded-full bg-(--color1) cursor-pointer w-8 h-6 relative" >
                        {image && image.length > 0 && <div className="absolute -top-6 bg-(--color4) text-(--color1) text-[.8rem] rounded-full px-[10px] py-1" > {image.length} </div>}
                        <AiOutlinePicture title="upload image" className="text-2xl  z-10 absolute inset-0 bg-(--color1)" />
                        <input type="file" multiple accept="image/*" {...register("image")} className="opacity-0 absolute inset-0 h-full w-full z-10" />
                    </div>


                    <div className="rounded-full bg-(--color1) cursor-pointer w-8 relative h-6" >

                        {video && video.length > 0 && <div className="absolute -top-6 bg-(--color4) text-(--color1) text-[.8rem] rounded-full px-[10px] py-1" > {video.length} </div>}
                        <MdOutlineSlowMotionVideo title="upload video" className="text-2xl  z-10 absolute inset-0 bg-(--color1)" />
                        <input type="file" multiple accept="video/*" {...register("video")} className="opacity-0 absolute inset-0 h-full w-full z-10" />
                    </div>



                    <div className="rounded-full bg-(--color1) cursor-pointer w-8 relative h-6" >
                        {audio && audio.length > 0 && <div className="absolute -top-6 bg-(--color4) text-(--color1) text-[.8rem] rounded-full px-[10px] py-1" > {audio.length} </div>}
                        <LuAudioLines title="upload audio" className="text-2xl  z-10 absolute inset-0 bg-(--color1)" />
                        <input type="file" multiple accept="audio/*" {...register("audio")} className="opacity-0 absolute inset-0 h-full w-full z-10" />
                    </div>



                    <textarea rows={5} placeholder="write your thoughts ..." className="grow resize-none p-2 h-20" {...register("text", { required: "" })} />


                    <button type="submit" className="bg-(--color1a) p-2 rounded-lg hover:opacity-80" >
                        Send
                    </button>
                </form>


            </div>

        </div>
    )
}

