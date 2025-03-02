import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/mainPage/mainPage";
import GoogleRegister from "./pages/auth/Register";
import GoogleLogin from "./pages/auth/login";
import Account from "./pages/account/account";
import CreateCourse from "./pages/course/Courses";
import CourseList from "./components/mainPage/CourseList"
import CoursePage from "./pages/course/CourseDetail";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from './pages/mainPage/Layout';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider 
            clientId="493735588229-7tn4qrs22e404m7te2gffriqpthdav2r.apps.googleusercontent.com"
            onScriptLoadSuccess={() => console.log('Google script loaded successfully')}
        >
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/register" element={<GoogleRegister />} />
                        <Route path="/login" element={<GoogleLogin />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/create_course" element={<CreateCourse />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/courses/:id" element={<CoursePage />} />
                    </Routes>
                </Layout>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
