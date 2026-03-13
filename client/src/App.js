import { BrowserRouter, 
  Routes, 
  Route, 
  Router,
  Link } from 'react-router-dom';
import ForgotMyPassword from './pages/ForgotMyPassword.js';
import MyLoginPage from './pages/MyLoginPage.js';
import MyRegistrationPage from './pages/MyRegistrationPage.js';
import MyUserPortal from './pages/MyUserPortal.js';
import MyProjectPage from './pages/MyProjectPage.js'
import styles from './App.css'

function App() {
  return (
    
    <BrowserRouter className={styles}>
      <nav>
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link> |{' '}
        <Link to="/portal">Portal</Link> |{' '}
        <Link to="/project">Project</Link> |{' '}
      </nav>

      <Routes>
        <Route path="/" element={<MyLoginPage />} />
        <Route path="/forgot-password" element={<ForgotMyPassword />} />
        <Route path="/login" element={<MyLoginPage />} />
        <Route path="/register" element={<MyRegistrationPage />} />
        <Route path="/portal" element={<MyUserPortal />} />
        <Route path="/project" element={<MyProjectPage />} />
          <Route path="/" element={<MyUserPortal />} />
          {/* This route catches /project/1, /project/2, etc. */}
          <Route path="/project/:projectId" element={<MyProjectPage />} />
      </Routes>
      
    </BrowserRouter>
    
  );
}

export default App;