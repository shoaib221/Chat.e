

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from 'react';

import './index.css';
import reportWebVitals from './reportWebVitals.jsx';
import { AuthProvider } from './auth/context.jsx'
import { ThemeProvider } from './Theme/Theme.jsx';
import { SocketProvider } from './socket/socket.jsx'
import { Navbar, OptionBar } from './Nav_1/Navbar.jsx';
import { Auth } from './Auth_1/auth.jsx';
import { AuthContext } from './Auth_1/authContext.js';
import { GoogleAuth } from './Auth_1/GoogleAuth.jsx';
import { PageNotFound } from './Nav_1/PageNotFound.jsx';
import { Socket } from "./socket/socket.jsx";

import { Profile } from './Auth_1/profile.jsx';
import { Test } from './Test/test.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { Groups } from './Chat/Groups.jsx';
import { Story } from './Story/story.jsx';




const Home = () => {

	const navigate = useNavigate()

	return (
		<div id="home" style={{ display: 'flex' }} >
			<nav style={{ borderRight: '2px solid var(--color4)' }} >

				<div className="navop" onClick={() => navigate("/groups")} > Groups   </div>
				<div className='navop' onClick={() => navigate('/profile')}  > Profile </div>
				<div className='navop' onClick={() => navigate('/story')}  > Story </div>
				<div className='navop' onClick={() => navigate('/feed')}  > Feed </div>
			</nav>

			<Outlet />

		</div>
	)
}

function App() {
	const { user } = useContext(AuthContext);
	//console.log(user);

	return (
		<>

			<Routes>
				<Route exact path="/" element={user ? <Home /> : <Navigate to="/auth" />} >
					<Route path='groups/' element={<Groups />}  ></Route>
					<Route path='profile/' element={<Profile />} ></Route>
					<Route path='story/' element={<Story />} ></Route>
				</Route>
				<Route exact path='/auth' element={user ? <Navigate to="/" /> : <Auth />} >  </Route>
				<Route exact path='/google-auth' element={user ? <Navigate to="/" /> : <GoogleAuth />} >  </Route>


				<Route exact path='/test' element={<Test />} ></Route>
				<Route path='*' element={<PageNotFound />} ></Route>
			</Routes>

		</>
	);

}


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
	<ThemeProvider>
		<AuthProvider>
			<SocketProvider>

				<BrowserRouter>
					<App />
				</BrowserRouter>

			</SocketProvider>
		</AuthProvider>
	</ThemeProvider>

);

reportWebVitals();
