// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import MechanicSearch from './pages/MechanicSearch';
import RequestHelp from './pages/RequestHelp';
import Shop from './pages/Shop';
import About from './pages/About';
import Profile from './pages/Profile';
import Services from './pages/Services';
import GetQuote from './components/GetQuote';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16"> {/* Padding for navbar overlap */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mechanic-search" element={<MechanicSearch />} />
          <Route path="/request-help" element={<RequestHelp />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
        </Routes>
        <GetQuote />
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}