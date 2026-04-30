import { useAuthContext } from "@/react-library/auth/context"
import { PageTag, SearchTag, usePagination } from "@/react-library/pagination/pagination2";
import { useSocketContext } from "@/react-library/socket/socket";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateGroup = (props) => {
    const { axiosInstance } = useAuthContext();
    const [name, setName] = useState("")
    const [error, setError] = useState(null)

    async function createGroup () {
        try {
            let res = await axiosInstance.post( '/chat/create-group', { newGroup: name } );
            setName("")
            setError(null);
            toast.success("Group created successfully");
            props.refetchGroups();
        } catch(err) {
            console.log(err);
            setError(err.response.data.error)
            toast.error("Error !");
        }
    }


    return (
        <div>
            <div className="header-11" >Create New Group</div>
            <div className="flex w-full max-w-[600px] gap-2 mx-auto" >
                <input placeholder="Group name" className="grow input-11" value={name} onChange={(e)=> setName( e.target.value )} />
                <button onClick={createGroup} >Submit</button>

            </div>
            { error && <div>{error}</div> }
        </div>
    )
}



export const Groups = () => {
    const { data, loading, page, pages, setPage, searchFor, setSearchFor, fetchData } = usePagination({ url: "/chat/fetch-groups" });
    const { axiosInstance } = useAuthContext();
    const navigate = useNavigate();
    const { onlineUsers } = useSocketContext()

    return (
        <div>
            <CreateGroup refetchGroups={fetchData} />

            <div className="header-11" >Your Groups</div>

            <SearchTag searchFor={searchFor} setSearchFor={setSearchFor} fetchData={fetchData} />

            { data && data.map( (elem, _) => <div onClick={ () => navigate(`/group-chat/${ elem._id.toString() }`) } className="box-13" key={_} >{ elem.name }</div> ) }

            <PageTag page={page} pages={pages} setPage={setPage} loading={loading} data={data} />
        </div>
    )
}