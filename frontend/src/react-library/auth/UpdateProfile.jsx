import { updateProfile } from "firebase/auth";
import { auth } from './firebase.config';
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "./context";
import { Loading } from "../miscel/Loading";
import { NotFound } from "../miscel/NotFound";
import { data, Navigate, useLocation } from "react-router-dom";
import { Grid, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { PrivateRoute } from "./RestrictedRoutes";
import { FaRegSmile } from "react-icons/fa";
import axios from "axios";
import { uploadToCloudinary } from "../Media/cloudinary_upload";
import { usePagination11, PageTag, SearchTag } from "../pagination/pagination1";
import { Label } from "recharts";

function Users () {
    const { data, loading, page, pages, setPage, searchBy, setSearchBy, searchFor, setSearchFor, fetchData } = usePagination11( { url: "/chat/users" } );

    const searchParams = [
        { value: 'friend', label: "Friends" },
        { value: 'others', label: "Others" }
    ]


    return (
        <div>
            
            <SearchTag searchFor={searchFor} searchBy={searchBy} setSearchBy={setSearchBy} setSearchFor={setSearchFor} searchParams={searchParams} fetchData={fetchData} />

            { data && data.length >0 && data.map( (elem, i) => (
                <div key={i}  >
                    { elem.id }
                </div>
            ) ) }

            <PageTag page={page} pages={pages} setPage={setPage} loading={loading} data={data} />

            
        </div>
    )



}


export const UpdateProfile = () => {
    const { user, loading, setUser } = useAuthContext();
    const location = useLocation();
    const [name, setName] = useState("");
    const [photo, setPhoto] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const { axiosInstance } = useAuthContext();
    


    useEffect(() => {
        if (!user) return;
        //console.log(user)
        setName(user.displayName);
        setPhoto(user.photo);
        setNumber(user.phoneNumber);
        setEmail(1);
    }, [user])


    async function Update() {
        try {
            const updation = { displayName: name, phoneNumber: number };

            if (imageFile) {


                const imageURL = await uploadToCloudinary(imageFile, "image")


                setPhoto(imageURL);
                updation.photoURL = imageURL;
            }

            // Update Firebase profile
            await updateProfile(auth.currentUser, updation);

            toast.success("Profile Updated Successfully");
            console.log("Updated profile:", updation);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        }
    }

    const imageChange = (event) => {
        let file = event.target.files[0];

        if (file) {
            setImageFile(file)
            let url = URL.createObjectURL(file)
            setPhoto(url)
        }
    }


    return (
        <PrivateRoute>
            <div className="flex flex-col  items-center grow p-2 gap-4" >


                <div className="rounded-full bg-cover bg-center h-60 w-60 min-w-60 relative border-2 border-(--color4) mx-auto"
                    style={{ backgroundImage: `url(${photo})` }} >

                    <div className="rounded-full bg-[var(--color1)] absolute top-[75%] right-2 cursor-pointer" >
                        <FaRegSmile title="upload image" className="text-2xl" />
                        <input type="file" onChange={imageChange} className="opacity-0 absolute top-0 left-0 h-full w-full" />
                    </div>
                </div>


                <br />

                <div className="grow lg:p-2" >


                    <div className="header-13" >Username</div>
                    <div> {user?.email} </div>
                    <br/>


                    <div className="header-13" >Name</div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="input-11" />
                    <br / >

                    <div onClick={Update} className="button-1234"  >Update</div>

                    
                    
                    

                    

                </div>


            </div>
        </PrivateRoute>
    )
}

// displayName, email, emailVerified,
// metadata, phoneNumber, photoURL

export const UpdateProfileED2 = () => {

    return (
        <></>
    )
}