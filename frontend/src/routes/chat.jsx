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


export const Chat = () => {
    const [partner, setPartner] = useState(null);

    return (
        <PrivateRoute>
            <div className="flex h-[calc(100vh-60px)] gap-4" >
                <Users setPartner={setPartner} partner={partner} />
                {partner && <ChatBox partner={partner} />}
            </div>
        </PrivateRoute>
    )
}


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
        <div className="flex flex-col min-w-80 gap-2 p-2"  >
            {users && users.map(elem => <p onClick={() => props.setPartner(elem)} className={`${elem?.username === props?.partner?.username ? "bg-(--color1a)" : ""} cursor-pointer hover:bg-(--color1a) flex items-center gap-2 p-2 rounded-lg`} >
                <div className={`h-6 w-6 rounded-full bg-cover bg-top`} style={{ backgroundImage: `url(${elem.photo})` }} ></div> {elem.name}
                {onlineUsers[elem.username] && <span className="h-2 w-2 bg-green-400 rounded-full"></span>}
            </p>)}
        </div>
    )
}


const ChatBox = ({ partner }) => {
    const [messages, setMessages] = useState(null);
    const { user, axiosInstance, axiosFormData } = useAuthContext();
    const { socket, onlineUsers } = useSocketContext();
    const { register, reset, handleSubmit, watch } = useForm();

    let image = watch("image");
    let video = watch("video");
    let audio = watch("audio");


    async function FetchMessage() {
        try {
            let res = await axiosInstance.post('/chat/fetch-message', { partner });
            setMessages(res.data.messages);
        } catch (err) {
            console.log(err);
        }
    }

    


    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            console.log("message received:", data, partner);
            if (partner.username !== data.messages[0].sender) return;



            setMessages(prevMessages => {

                let newMessages = prevMessages;
                newMessages = newMessages.concat(data.messages);
                console.log(newMessages);
                return newMessages;
            });
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };

    }, [socket]);



    useEffect(() => {
        if (!user || !partner) return;

        FetchMessage();

    }, [user, partner]);


    async function SendMessage(data) {
        try {

            const formData = new FormData();

            console.log(data.image.length);

            if (data.image?.length > 0) Array.from(data.image).forEach((file) => {
                formData.append("image", file);
                console.log("image");
            });

            if (data.video?.length > 0) Array.from(data.video).forEach((file) => {
                formData.append("video", file);
                console.log("video");
            });

            if (data.audio?.length > 0) Array.from(data.audio).forEach((file) => {
                formData.append("audio", file);
                console.log('audio');
            });

            if (data.text && data.text.trim() !== "") formData.append("text", data.text);

            formData.append("receiver", partner.username);

            console.log(formData)

            let res = await axiosFormData.post('/chat/send-message', formData);

            console.log(res.data);

            let newMessages = messages;
            newMessages = newMessages.concat(res.data.messages);

            console.log(newMessages);

            setMessages(newMessages);
            reset();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="relative h-[calc(100vh-60px)] grow bg-(--color1a)" >
            <div className="h-10 absolute top-0 left-0 right-0 bg-(--color1) flex z-10 gap-4 items-center" >
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

