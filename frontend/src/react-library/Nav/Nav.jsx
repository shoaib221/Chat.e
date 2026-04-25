import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Nav.css';
import { useNavContext } from './context.jsx';
import { Breaker } from '../miscel/Breaker.jsx';
import { FaGraduationCap } from "react-icons/fa6";
import { ThemeButton3, useThemeContext } from '../Theme/Theme.jsx';
import { ProfileLogo1 } from './profile.jsx';
import { TbMessageCircleHeart } from "react-icons/tb";


export const Logo = () => {
    return (
        <div className='h-[3rem] text-[var(--color4)] flex gap-2' >
            <TbMessageCircleHeart className='h-full text-2xl' />
            <div className='cen-ver font-black' >Chat.e</div>
        </div>
    )
}

const ScrollToTop = () => {

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div title='Back To Top' onClick={ scrollToTop } className='fixed cen-hor text-xl bottom-4 right-4 z-30 h-10 w-10 rounded-full border-2 border-(--color1) bg-(--color4) text-(--color1)' >
            <IoArrowUpSharp  />
        </div>
    );
};


export const Nav = () => {
    const { ThemeChoice } = useThemeContext()
    const {  navi, Navigate  } = useNavContext();
    const { user, LogOut } = useAuthContext();
    const [ navBar, setNavBar ] = useState(false)

    



    return (
        <nav id='top' className='z-30 bg-(--color1) flex h-14 justify-between p-4 items-center fixed top-0 w-full max-w-[1800px] border-b-2 border-(--color1a)' >
            <div className='block lg:hidden' onClick={ () => setNavBar(true) } >
                Bar
            </div>

            {/* Small Screen sidebar */}
            <div className={ `sidebar ${ navBar? 'open' : "" }` } >
                <div className="absolute top-0 left-0 right-0 h-10 bg-red-800 text-white text-center" onClick={ () => setNavBar(false) } > Close </div>
                <div className='h-8' ></div>
                <div onClick={ () => Navigate('/') } >Chat</div>
                <div onClick={ () => Navigate('/groups') } >Groups</div>
            </div>



            <Logo />


            <div className='hidden lg:flex gap-2 p-2' >
                <div onClick={ () => Navigate('/') } className={ `oplink ${ navi === 'chat' && 'selected' }` } >Chat</div>
                <div onClick={ () => Navigate('/groups') }  className={ `oplink ${ navi === 'groups' && 'selected' }` } >Groups</div>
            </div>

            

            {/* <div onClick={ () => navigate('/') } style={{ cursor: 'pointer' }} className={ `${location.pathname === '/'? 'hilit-1': ''}` } >Home</div> */}



            {/* {down1 ?
                <div className='flex justify-center px-6 items-center lg:hidden cursor-pointer' onClick={() => DownWindow(false)} >
                    Menu
                </div>
                :
                <div className='flex justify-center px-6 items-center lg:hidden cursor-pointer' onClick={() => DownWindow(true)} >
                    Back
                </div>
            } */}

            {/* <div className={`${down1 ? "hidden" : "flex"} fixed z-30  bg-[var(--color1)]  flex-col items-center top-14 left-0 right-0 bottom-0 p-4 gap-4`}  >
                <div onClick={() => DownWindow(true, "/")} className={`class-1 ${navi === "home" && "active-navi"}`}  >Home</div>
                <div onClick={() => DownWindow(true, "/chat")} className={`class-1 ${navi === "chat" && "active-navi"}`} >Chat</div>
                <div onClick={() => DownWindow(true, "/groups")} className={`class-1 ${navi === "groups" && "active-navi"}`} >Groups</div>
            </div>


            <div className='hidden lg:flex text-[0.9rem]' >
                <div onClick={() => DownWindow(true, "/")} className={`class-1 ${navi === "home" && "active-navi"}`}  >Home</div>
                <div onClick={() => DownWindow(true, "/chat")} className={`class-1 ${navi === "chat" && "active-navi"}`} >Chat</div>
                <div onClick={() => DownWindow(true, "/groups")} className={`class-1 ${navi === "groups" && "active-navi"}`} >Groups</div>
            </div> */}

            

            <ProfileLogo1 />

            
        </nav>
    );
};



import { IoArrowUpSharp, IoMailSharp } from "react-icons/io5";
import { FaGlobe } from "react-icons/fa";
import { useAuthContext } from '../auth/context';


export const Footer = () => {

    return (
        <div className='py-4 bg-(--color-c4) text-white mt-16' >
            <div className='text-2xl font-bold text-center' >Connect Us</div>
            <br />

            <div className='flex flex-col lg:flex-row text-xl gap-4' >

                {/* social links */}
                <div className='lg:min-w-[40%] gap-2 grid grid-cols-[1fr_1fr] justify-center items-center pr-4' >

                    <div className='flex flex-row-reverse items-center gap-2' >
                        <FaFacebook className='inline-block mr-2' />
                        <span className='hover:underline text-sm cursor-pointer'
                            onClick={() => window.open('https://web.facebook.com/programmingHero', '_blank')} >ScholarStream</span>
                    </div>

                    <div className='flex flex-row-reverse items-center gap-2' >
                        <FaLinkedin className='inline-block mr-2' />
                        <span className='hover:underline text-sm cursor-pointer'
                            onClick={() => window.open('https://bd.linkedin.com/company/programminghero', '_blank')} >ScholarStream</span>
                    </div>

                    <div className='flex flex-row-reverse items-center gap-2' >
                        <FaPhone className='inline-block mr-2' />
                        <span className='hover:underline text-sm cursor-pointer'
                        >01303909909</span>
                    </div>

                    <div className='flex flex-row-reverse items-center gap-2' >
                        <IoMailSharp className='inline-block mr-2' />
                        <span className='hover:underline text-sm cursor-pointer'
                        >info@scholarstream.com</span>
                    </div>

                    <div className='flex flex-row-reverse items-center gap-2' >
                        <FaGlobe className='inline-block mr-2' />
                        <span className='hover:underline text-sm cursor-pointer'
                            onClick={() => window.open('https://scholarstream-shoaib221.netlify.app', '_blank')}
                        >scholarstream.com</span>
                    </div>


                </div>

                <div className='flex-grow p-2 flex flex-col items-center' >

                    <textarea placeholder='Write Your Query' rows={3} className='resize-none text-lg' />
                    <button className='font-bold text-lg button-91 my-2' >Send Message</button>

                </div>





            </div>

            <br />
            <br />

            <div style={{ textAlign: 'center', marginTop: '1rem' }} >
                Copyright © 2026 - All right reserved
            </div>
        </div>
    )
}




