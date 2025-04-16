import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <GoogleOAuthProvider clientId="493735588229-7tn4qrs22e404m7te2gffriqpthdav2r.apps.googleusercontent.com"> {/* Вставте ваш clientId */}
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </GoogleOAuthProvider>
    );
} 