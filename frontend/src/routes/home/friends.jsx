import { useAuthContext } from "@/react-library/auth/context";
import { usePagination, PageTag, SearchTag } from "@/react-library/pagination/pagination2";
import { useEffect, useCallback, useState } from "react"
import '../../react-library/Box/box1.css'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "@/react-library/socket/socket";
import { useConfirmer } from "@/react-library/miscel/confirmer";


export function Friends() {
    const { data, loading, page, pages, setPage, searchFor, setSearchFor, fetchData } = usePagination({ url: "/chat/friends" });
    const { axiosInstance } = useAuthContext();
    const navigate = useNavigate();
    const { onlineUsers } = useSocketContext();
    const [friend, setFriend] = useState(null)

    

    const { Tag: UnfriendConfirmerTag, Init: UnfriendConfirmerInit, procede: unfriendProcede } = useConfirmer("Are you sure to Unfriend")


    useEffect(() => {
        if (!unfriendProcede || !friend) return;

        async function Unfriend() {
            try {
                await axiosInstance.post("/chat/unfriend", { friend });
                fetchData();
                toast.success("Unfriended");
                setFriend(null)
            }
            catch (err) {
                console.log(err);
                alert("error");
            }
        }
        Unfriend()
    }, [unfriendProcede, axiosInstance, fetchData, friend])



    return (
        <div>
            <UnfriendConfirmerTag />

            <SearchTag searchFor={searchFor} setSearchFor={setSearchFor} fetchData={fetchData} />

            <div className="flex flex-col gap-4 p-4 max-w-200 mx-auto" >

                {data && data.length > 0 && data.map((elem, i) => (
                    <div key={i} className="box-13 flex justify-between" onClick={() => navigate(`/chat/${elem._id.toString()}`)} >
                        <div>

                            <div className="text-(--color4) flex gap-2 items-center" > {elem.name} {"  "} <div className={`h-2 w-2 rounded-full ${onlineUsers[elem.username] ? 'bg-green-600' : 'bg-(--color1)'}`} ></div> </div>
                            <div> {elem.username} </div>


                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); setFriend(elem); UnfriendConfirmerInit("Sure to unfriend ?"); }}
                            className="hover:opacity-80"
                        >
                            Unfriend
                        </button>
                    </div>
                ))}

            </div>

            <PageTag page={page} pages={pages} setPage={setPage} loading={loading} data={data} />

        </div>
    )



}