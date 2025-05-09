import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./sideBar";
import CourseList from "../../components/course/CourseList"; // Update path
import WeeklyTasks from "./weeklyTask"; // Add this import
import { fetchCourses } from "../../services/course/courseService"; // Update path
import HeroSection from "./heroSection"; // Update path
import "./stylesMP/mainPage.css";

interface Course {
    _id: string;
    title: string;
    description: string;
    author_email: string;
    created_at: string;
}

interface MainPageProps {
    activePage?: string;
}

const MainPage: React.FC<MainPageProps> = ({ activePage: initialActivePage = "home" }) => {
    const [activePage, setActivePage] = useState<string>(initialActivePage);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activePage === "courses") {
            setLoading(true);
            const loadCourses = async () => {
                try {
                    const fetchedCourses = await fetchCourses();
                    setCourses(fetchedCourses);
                    setError(null);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Не вдалося отримати курси");
                    setCourses([]);
                } finally {
                    setLoading(false);
                }
            };

            loadCourses();
        }
    }, [activePage]);

    const handlePageSelect = (page: string) => {
        setActivePage(page);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
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
                        loading ? (
                            <div className="loading">Завантаження курсів...</div>
                        ) : error ? (
                            <div className="error">{error}</div>
                        ) : (
                            <CourseList courses={courses} />
                        )
                    ) : (
                        <div className="welcome-content">
                            <HeroSection />
                            <WeeklyTasks />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MainPage;
