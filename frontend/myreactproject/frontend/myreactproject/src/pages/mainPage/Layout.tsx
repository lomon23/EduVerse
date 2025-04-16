import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './sideBar';
import './stylesMP/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSelect = (page: string) => {
        // Handle page selection
        console.log(page);
    };

    return (
        <div className="layout">
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar onSelect={handleSelect} isOpen={isSidebarOpen} />
            <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;