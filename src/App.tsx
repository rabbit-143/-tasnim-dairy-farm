import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import WelcomeAnimation from './components/WelcomeAnimation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FoundersPage from './pages/FoundersPage';
import FarmPage from './pages/FarmPage';
import GalleryPage from './pages/GalleryPage';
import GrowthPage from './pages/GrowthPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './pages/AdminPanel';
import BackToTop from './components/BackToTop';

const AppContent: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3900);
    return () => clearTimeout(timer);
  }, []);

  // Check if current route is admin
  const isAdminPage = location.pathname === '/admin';

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, Inter, sans-serif' }}>
      {showWelcome && <WelcomeAnimation />}

      {!isAdminPage && <Navbar />}

      <main style={{ minHeight: isAdminPage ? '100vh' : 'calc(100vh - 120px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/founders" element={<FoundersPage />} />
          <Route path="/farm" element={<FarmPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPanel setCurrentPage={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}

      {!isAdminPage && <BackToTop />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AdminProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminProvider>
  );
};

export default App;
