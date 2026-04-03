import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotMyPassword from './pages/ForgotMyPassword.js';
import MyLoginPage from './pages/MyLoginPage.js';
import MyRegistrationPage from './pages/MyRegistrationPage.js';
import MyUserPortal from './pages/MyUserPortal.js';
import MyProjectPage from './pages/MyProjectPage.js';
import styles from './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* The <nav> block was removed from here */}
      
      <Routes>
        <Route path="/" element={<MyLoginPage />} />
        <Route path="/forgot-password" element={<ForgotMyPassword />} />
        <Route path="/login" element={<MyLoginPage />} />
        <Route path="/register" element={<MyRegistrationPage />} />
        <Route path="/portal" element={<MyUserPortal />} />
        <Route path="/project" element={<MyProjectPage />} />
        <Route path="/project/:projectId" element={<MyProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;