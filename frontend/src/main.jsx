import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { NotFound } from '@/react-library/miscel/NotFound.jsx';
import { Auth } from '@/react-library/auth/auth.jsx';
import { AuthProvider } from '@/react-library/auth/context.jsx';
import { Test } from './test/test.jsx';
import { UpdateProfile } from '@/react-library/auth/UpdateProfile.jsx';
import { Home } from '@/routes/Home.jsx';
import { Entry } from '@/routes/layout.jsx';
import { NavProvider } from './react-library/Nav/context.jsx';
import { ThemeProvider } from '@/react-library/Theme/Theme.jsx';


import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Chat } from './routes/chat.jsx';
import { Groups } from './routes/groups.jsx';
import { SocketProvider } from './react-library/socket/socket.jsx';

const queryClient = new QueryClient();

const App = () => {


    return (
        <QueryClientProvider client={queryClient} >
        <BrowserRouter>
            <ThemeProvider>
            <AuthProvider>
            <SocketProvider>
            <NavProvider>
                    <ToastContainer />
                    <Routes>
                        <Route path='/' element={<Entry />} >
                            <Route index element={<Chat />} />
                            <Route path='auth' element={<Auth />} />
                            <Route path='test' element={<Test />} />
                            <Route path='profile' element={<UpdateProfile />} />
                            <Route path='chat' element={ <Chat /> } />
                            <Route path='groups' element={ <Groups /> } />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
            </NavProvider>
            </SocketProvider>
            </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
        </QueryClientProvider>
    )
}



createRoot(document.getElementById('root')).render(<App />);

