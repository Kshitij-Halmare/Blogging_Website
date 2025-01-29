import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Authetication/Authentication.jsx';
// import EditorPage, { EditorContext } from './Pages/Editor/EditorPage.jsx';
createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <Toaster/>
    <App />
    </AuthProvider>
);
