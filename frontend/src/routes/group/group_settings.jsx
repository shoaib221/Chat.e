import { useAuthContext } from "@/react-library/auth/context";
import { uploadToCloudinary } from "@/react-library/Media/cloudinary_upload";
import { Loading } from "@/react-library/miscel/Loading";
import { Message1 } from "@/react-library/miscel/message";
import { NotFound } from "@/react-library/miscel/NotFound";
import { useSocketContext } from "@/react-library/socket/socket";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePicture } from "react-icons/ai";
import { LuAudioLines } from "react-icons/lu";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { usePagination } from '@/react-library/pagination/pagination2'
import { PageTag, SearchTag } from "@/react-library/pagination/pagination2";
import { toast } from "react-toastify";


const GroupMembers = () => {

    return (
        <div>

        </div>
    )
}






export const GroupSettings = (props) => {
    const [ membersMap, setMembersMap ] = useState( new Set() );
    const { data, loading, page, pages, setPage, searchFor, setSearchFor, fetchData } = usePagination({ url: "/chat/friends" });
    const { axiosInstance, user } = useAuthContext();
    const navigate = useNavigate();
    const { onlineUsers } = useSocketContext();


    useEffect(() => {
        if (!props.members) return new Set();
        setMembersMap( new Set(props.members.map(m => m._id.toString()))  );
    }, [props.members]);


    async function AddToGroup(new_member) {

        try {
            let res = await axiosInstance.post('/chat/add-to-group', { new_member, group: props.group });
            let new_map = membersMap;
            new_map.add( new_member._id.toString() )
            setMembersMap( new_map )
            toast.success("Member added successfully")
        } catch (err) {
            console.log(err);
            alert("error");
        }

    }


    async function RemoveFromGroup(member) {
        try {
            let res = await axiosInstance.post('/chat/remove-from-group', { member, group: props.group });
            let new_map = membersMap;
            new_map.delete( member._id.toString() )
            setMembersMap( new_map )
            toast.success("Member removed successfully")
        } catch (err) {
            console.log(err);
            alert("error");
        }
    }



    return (
        <div className="grow justify-center items-center overflow-auto pt-12 pb-24 max-h-[calc(100vh-60px)] bg-(--color1a) p-4 border-2" >
            <div className="header-11" >Settings</div>

            <div className="header-11" >Members</div>

            <div className="flex flex-col gap-4 p-4 max-w-200 mx-auto w-full" >

                {props.members && props.members.map((elem, _) => <div key={_} className="box-13 flex justify-between w-full" >
                    <div> {elem.name} {"    "} <div className={ `inline-block h-2 w-2 rounded-full ${ onlineUsers[ elem.username ] ? "bg-green-700" : "" }` } > </div> <br /> { elem.username } </div>

                    {props.admin._id.toString() === elem._id.toString() ? <div>Admin</div> : props.admin._id.toString() === user._id.toString() && <button onClick={() => RemoveFromGroup(elem)} className="hover:opacity-80" >Remove From Group</button> }
                    

                </div>)}

            </div>


            <div className="header-11" >Friends</div>

            <div>


                <SearchTag searchFor={searchFor} setSearchFor={setSearchFor} fetchData={fetchData} />

                <div className="flex flex-col gap-4 p-4 max-w-200 mx-auto" >

                    {data && data.length > 0 && data.map((elem, i) => {
                        if (membersMap.has(elem._id.toString()) ) return <></>;

                        return (<div key={i} className="box-13 flex justify-between"  >
                            <div>

                                <div className="text-(--color4) flex gap-2 items-center" > {elem.name} {"  "} <div className={`h-2 w-2 rounded-full ${onlineUsers[elem.username] ? 'bg-green-600' : 'bg-(--color1)'}`} ></div> </div>
                                <div> {elem.username} </div>


                            </div>

                            <button className="hover:opacity-80" onClick={() => AddToGroup(elem)} >Add as Member</button>
                        </div>)
                    })}

                </div>

                <PageTag page={page} pages={pages} setPage={setPage} loading={loading} data={data} />


            </div>
        </div>
    )
}