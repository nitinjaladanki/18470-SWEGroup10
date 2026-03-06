import { BrowserRouter, 
  Routes, 
  Route, 
  Link } from 'react-router-dom';
import ForgotMyPassword from './pages/ForgotMyPassword.js';
import MyLoginPage from './pages/MyLoginPage.js';
import MyRegistrationPage from './pages/MyRegistrationPage.js';
import MyUserPortal from './pages/MyUserPortal.js';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/forgot-password">Forgot Password</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link> |{' '}
        <Link to="/portal">Portal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MyLoginPage />} />
        <Route path="/forgot-password" element={<ForgotMyPassword />} />
        <Route path="/login" element={<MyLoginPage />} />
        <Route path="/register" element={<MyRegistrationPage />} />
        <Route path="/portal" element={<MyUserPortal />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;