import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SideBar from './sideBar'
import './stylesMP/mainPage.css';

const MainPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h2>Welcome to the Main Page</h2>
                <p>This is the main content area.</p>
            </main>
            <SideBar />
            <Footer />
        </div>
    );
};

export default MainPage;