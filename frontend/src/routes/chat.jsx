import { useAuthContext } from "@/react-library/auth/context";
import { useSocketContext } from "@/react-library/socket/socket";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegSmile } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { LuAudioLines } from "react-icons/lu";


export const Chat = () => {
    const [partner, setPartner] = useState(null);

    return (
        <div className="flex grow gap-4" >
            <Users setPartner={setPartner} />
            {partner && <ChatBox partner={partner} />}
        </div>
    )
}


const Users = (props) => {
    const [users, setUsers] = useState(null);
    const { user, axiosInstance } = useAuthContext();



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
        <div className="flex flex-col min-w-80 gap-4"  >
            {users && users.map(elem => <p onClick={() => props.setPartner(elem)} >{elem.name}</p>)}
        </div>
    )
}


const ChatBox = ({ partner }) => {
    const [messages, setMessages] = useState(null);
    const { user, axiosInstance, axiosFormData } = useAuthContext();
    const { socket } = useSocketContext();
    const { register, reset, handleSubmit } = useForm();

    async function FetchMessage() {

        try {
            let res = await axiosInstance.post('/chat/fetch-message', { partner })
            setMessages(res.data.messages)
            //alert("message fetched")
        } catch (err) {
            console.log(err);
        }
    }


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

            formData.append("text", data.text);

            formData.append("receiver", partner.username);

            console.log(formData)

            let res = await axiosFormData.post('/chat/send-message', formData);




        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="grow flex flex-col" >
            <div className="min-h-20" >
                {partner.name}
            </div>

            <div className="grow " >
                {messages && messages.map(elem => <p>h</p>)}
            </div>

            <div className="min-h-20" >
                <form onSubmit={handleSubmit(SendMessage)} className="flex gap-4" >

                    <div className="rounded-full bg-(--color1) cursor-pointer" >
                        <AiOutlinePicture title="upload image" className="text-2xl" />
                        <input type="file" multiple accept="image/*" {...register("image")}  className="opacity-0 absolute top-0 left-0 h-full w-full" />
                    </div>


                    <div className="rounded-full bg-(--color1) cursor-pointer" >
                        <MdOutlineSlowMotionVideo title="upload video" className="text-2xl" />
                        <input type="file" multiple accept="video/*" {...register("video")}  className="opacity-0 absolute top-0 left-0 h-full w-full" />
                    </div>

                    <div className="rounded-full bg-(--color1) cursor-pointer" >
                        <LuAudioLines title="upload audio" className="text-2xl" />
                        <input type="file" multiple accept="audio/*" {...register("audio")}  className="opacity-0 absolute top-0 left-0 h-full w-full" />
                    </div>

                    <input placeholder="write" className="grow" {...register("text", { required: "" })} />


                    <button type="submit" >
                        Send
                    </button>
                </form>


            </div>

        </div>
    )
}

