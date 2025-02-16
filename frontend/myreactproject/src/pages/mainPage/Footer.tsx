import React from 'react';
import './stylesMP/Footer.css';
const Footer: React.FC = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
        </footer>
    );
};

export default Footer;