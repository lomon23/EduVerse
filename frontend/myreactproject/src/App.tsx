import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage/mainPage";
import GoogleRegister from "./pages/auth/Register";
import GoogleLogin from "./pages/auth/login";
import Account from "./pages/account/account";
import CreateCourse from "./pages/course/Courses";
import CourseDetail from "./pages/course/CourseDetail";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from './pages/mainPage/Layout';
import CreateRoom from "./pages/socket_room/CreateRoom";  
import Room from './pages/socket_room/Room';
import ChatRoom from './pages/socket_room/ChatRoom';
import BoardRoom from './pages/socket_room/BoardRoom';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider 
            clientId="493735588229-7tn4qrs22e404m7te2gffriqpthdav2r.apps.googleusercontent.com"
        >
            <Router>
                <Routes>
                    <Route path="/" element={<Layout><MainPage /></Layout>} />
                    <Route path="/register" element={<Layout><GoogleRegister /></Layout>} />
                    <Route path="/login" element={<Layout><GoogleLogin /></Layout>} />
                    <Route path="/account" element={<Layout><Account /></Layout>} />
                    <Route path="/create_course" element={<Layout><CreateCourse /></Layout>} />
                    <Route path="/courses" element={<Layout><MainPage activePage="courses" /></Layout>} />
                    <Route path="/courses/:id/*" element={<Layout><CourseDetail /></Layout>} />
                    <Route path="/CreateRoom" element={<Layout><CreateRoom /></Layout>} />
                    <Route path="/Room" element={<Layout><Room /></Layout>} />
                    <Route path="/room/:roomId" element={<Layout><Room /></Layout>} />
                    <Route path="/chat" element={<Layout><ChatRoom /></Layout>} />
                    <Route path="/board" element={<Layout><BoardRoom /></Layout>} />
                    <Route path="/board-room/:id" element={<Layout><BoardRoom /></Layout>} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;