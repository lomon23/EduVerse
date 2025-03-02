import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./sideBar";
import CourseList from "../../components/mainPage/CourseList";
import "./stylesMP/mainPage.css";

const MainPage: React.FC = () => {
    const [activePage, setActivePage] = useState<string>("home");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Changed to true for default open state

    const handlePageSelect = (page: string) => {
        setActivePage(page);
        console.log('Selected page:', page);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        console.log('Sidebar state:', !isSidebarOpen);
    };

    return (
        <div className="main-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <Sidebar 
                    onSelect={handlePageSelect} 
                    isOpen={isSidebarOpen} 
                />
                <main className="main-content">
                    {activePage === "courses" ? (
                        <CourseList />
                    ) : (
                        <div className="welcome-content">
                            <h2>Welcome to the Main Page</h2>
                            <p>This is the main content area.</p>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};
export default MainPage;
