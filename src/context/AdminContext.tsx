import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Founder, BlogPost, GalleryItem, CareerPost, SiteSettings, GrowthStat, ContactMessage,
  defaultSettings, defaultGrowthStats
} from '../data/store';

// Backend API base URL
const getApiUrl = () => {
  try {
    return (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';
  } catch {
    return 'http://localhost:3000/api';
  }
};

export const API_BASE_URL = getApiUrl();

// Fallback mock data for when backend is offline
const MOCK_DATA = {
  founders: [
    {
      id: 1,
      name: 'Mobasshera Sultana',
      role: 'Founder & CEO',
      responsibilities: ['Strategic Leadership', 'Farm Management', 'Growth Planning'],
      image: '/images/Founder & CEO.png'
    },
    {
      id: 2,
      name: 'Johirul Islam',
      role: 'Founder & CO',
      responsibilities: ['Operations', 'Expansion Planning', 'Resource Management'],
      image: '/images/Founder & CO.png'
    },
    {
      id: 3,
      name: 'Rakibul Hasan Rahat',
      role: 'Founder & Marketing Lead',
      responsibilities: ['Branding', 'Marketing', 'Public Relations'],
      image: '/images/Founder & Marketing Lead.png'
    },
    {
      id: 4,
      name: 'Anjhum Akter',
      role: 'Founder & Accountant',
      responsibilities: ['Financial Management', 'Accounting', 'Budget Planning'],
      image: '/images/Founder & Accountant.png'
    },
    {
      id: 5,
      name: 'Etheka Ariyana',
      role: 'Brand Ambassador',
      responsibilities: ['Brand Representation', 'Public Relations', 'Community Engagement'],
      image: '/images/Brand Ambassador.png'
    }
  ] as Founder[],
  settings: {
    id: 1,
    siteName: 'Tasnim Dairy Farm',
    tagline: 'Pure Milk, Pure Promise',
    phone: '+880 1700-000000',
    email: 'info@tasnimdairyfarm.com',
    address: 'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.3197948897306!2d90.36914952346814!3d23.810255589999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7212f5f5f5f%3A0x5f5f5f5f5f5f5f5f!2sTasnim%20Dairy%20Farm!5e0!3m2!1sen!2sbd!4v1234567890',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/8801700000000',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
    aboutContent: 'Tasnim Dairy Farm was established on 14 February 2026 with a vision to revolutionize dairy farming in Bangladesh.',
    vision: 'To become one of the most trusted dairy farms in Bangladesh',
    mission: ['Produce healthy and pure milk', 'Maintain the highest farm hygiene standards', 'Ensure animal welfare and ethical treatment'],
    visitors: 10482
  } as SiteSettings
};

interface AdminContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => Promise<void>;
  founders: Founder[];
  setFounders: (f: Founder[]) => void;
  addFounder: (f: Omit<Founder, 'id'>) => Promise<void>;
  updateFounder: (id: number, f: Partial<Founder>) => Promise<void>;
  deleteFounder: (id: number) => Promise<void>;
  blogs: BlogPost[];
  setBlogs: (b: BlogPost[]) => void;
  addBlog: (b: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlog: (id: number, b: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;
  gallery: GalleryItem[];
  addGalleryItem: (g: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: number) => Promise<void>;
  careers: CareerPost[];
  addCareer: (c: Omit<CareerPost, 'id'>) => Promise<void>;
  updateCareer: (id: number, c: Partial<CareerPost>) => Promise<void>;
  deleteCareer: (id: number) => Promise<void>;
  messages: ContactMessage[];
  setMessages: (m: ContactMessage[]) => void;
  fetchMessages: () => Promise<void>;
  markMessageAsRead: (id: number) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  growthStats: GrowthStat[];
  updateGrowthStat: (index: number, stat: Partial<GrowthStat>) => void;
  loading: boolean;
  refetchFounders: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('tasnim_admin') === 'true';
  });
  const [loading, setLoading] = useState(false);
  
  // All data now fetched from backend (no localStorage)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [growthStats, setGrowthStats] = useState<GrowthStat[]>(() => {
    const saved = localStorage.getItem('tasnim_growth');
    return saved ? JSON.parse(saved) : defaultGrowthStats;
  });

  // Founders now fetched from backend (no localStorage)
  const [founders, setFounders] = useState<Founder[]>([]);

  // Fetch all data from backend on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Helper to safely fetch with type narrowing
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          return res;
        } catch {
          return null;
        }
      };

      const [foundersRes, blogsRes, galleryRes, careersRes, settingsRes, messagesRes] = await Promise.all([
        safeFetch(`${API_BASE_URL}/founders`),
        safeFetch(`${API_BASE_URL}/blogs`),
        safeFetch(`${API_BASE_URL}/gallery`),
        safeFetch(`${API_BASE_URL}/careers`),
        safeFetch(`${API_BASE_URL}/settings`),
        safeFetch(`${API_BASE_URL}/contact/messages`),
      ]);

      // Use mock data if backend is down
      if (foundersRes) setFounders(await foundersRes.json());
      else setFounders(MOCK_DATA.founders);
      
      if (blogsRes) setBlogs(await blogsRes.json());
      else setBlogs([]);
      
      if (galleryRes) setGallery(await galleryRes.json());
      else setGallery([]);
      
      if (careersRes) setCareers(await careersRes.json());
      else setCareers([]);
      
      if (settingsRes) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      } else {
        setSettings(MOCK_DATA.settings);
      }
      
      if (messagesRes) setMessages(await messagesRes.json());
      else setMessages([]);
      
      // Show warning if backend is down
      if (!foundersRes || !settingsRes) {
        console.warn('⚠️ Backend API is offline - using mock data. Contact forms will not be saved.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data on error
      setFounders(MOCK_DATA.founders);
      setSettings(MOCK_DATA.settings);
    } finally {
      setLoading(false);
    }
  };

  // localStorage only for growth stats
  useEffect(() => { localStorage.setItem('tasnim_growth', JSON.stringify(growthStats)); }, [growthStats]);

  const loginAdmin = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'tasnim@2026') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('tasnim_admin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('tasnim_admin');
  };

  const updateSettings = async (s: Partial<SiteSettings>) => {
    try {
      const updatedSettings = { ...settings, ...s };
      
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to save settings');
      throw error;
    }
  };

  // ═══════════════════════════════════════════════════════
  // FOUNDERS CRUD - Backend API calls
  // ═══════════════════════════════════════════════════════

  const addFounder = async (f: Omit<Founder, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/founders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add founder');
      }

      const newFounder = await response.json();
      setFounders(prev => [...prev, newFounder]);
    } catch (error) {
      console.error('Error adding founder:', error);
      alert(`Failed to add founder: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFounder = async (id: number, f: Partial<Founder>) => {
    try {
      setLoading(true);
      const currentFounder = founders.find(x => x.id === id);
      if (!currentFounder) {
        throw new Error('Founder not found');
      }

      const updatedData = { ...currentFounder, ...f };

      const response = await fetch(`${API_BASE_URL}/founders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update founder');
      }

      const updated = await response.json();
      setFounders(prev => prev.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error('Error updating founder:', error);
      alert(`Failed to update founder: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFounder = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/founders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete founder');
      }

      setFounders(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting founder:', error);
      alert(`Failed to delete founder: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // BLOGS CRUD - Backend API calls
  // ═══════════════════════════════════════════════════════

  const addBlog = async (b: Omit<BlogPost, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b),
      });

      if (!response.ok) throw new Error('Failed to add blog');

      const newBlog = await response.json();
      setBlogs(prev => [...prev, newBlog]);
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: number, b: Partial<BlogPost>) => {
    try {
      setLoading(true);
      const currentBlog = blogs.find(x => x.id === id);
      if (!currentBlog) throw new Error('Blog not found');

      const updatedData = { ...currentBlog, ...b };

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update blog');

      const updated = await response.json();
      setBlogs(prev => prev.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete blog');

      setBlogs(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // GALLERY CRUD - Backend API calls
  // ═══════════════════════════════════════════════════════

  const addGalleryItem = async (g: Omit<GalleryItem, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(g),
      });

      if (!response.ok) throw new Error('Failed to add gallery item');

      const newItem = await response.json();
      setGallery(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add gallery item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete gallery item');

      setGallery(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // CAREERS CRUD - Backend API calls
  // ═══════════════════════════════════════════════════════

  const addCareer = async (c: Omit<CareerPost, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });

      if (!response.ok) throw new Error('Failed to add career');

      const newCareer = await response.json();
      setCareers(prev => [...prev, newCareer]);
    } catch (error) {
      console.error('Error adding career:', error);
      alert('Failed to add career');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCareer = async (id: number, c: Partial<CareerPost>) => {
    try {
      setLoading(true);
      const currentCareer = careers.find(x => x.id === id);
      if (!currentCareer) throw new Error('Career not found');

      const updatedData = { ...currentCareer, ...c };

      const response = await fetch(`${API_BASE_URL}/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update career');

      const updated = await response.json();
      setCareers(prev => prev.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error('Error updating career:', error);
      alert('Failed to update career');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/careers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete career');

      setCareers(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('Failed to delete career');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // MESSAGES CRUD - Backend API calls
  // (these were declared in AdminContextType but never implemented
  //  or exposed via the Provider value below — that was the bug)
  // ═══════════════════════════════════════════════════════

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/contact/messages`);

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Failed to fetch messages');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (id: number) => {
    try {
      // NOTE: adjust this endpoint/method to match your backend route.
      // Common patterns: PUT /contact/messages/:id/read  or
      // PATCH /contact/messages/:id with body { read: true }
      const response = await fetch(`${API_BASE_URL}/contact/messages/${id}/read`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to mark message as read');

      const updated = await response.json();
      setMessages(prev => prev.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error('Error marking message as read:', error);
      alert('Failed to mark message as read');
      throw error;
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/contact/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGrowthStat = (index: number, stat: Partial<GrowthStat>) => {
    setGrowthStats(prev => prev.map((s, i) => i === index ? { ...s, ...stat } : s));
  };

  const refetchFounders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/founders`);
      if (res.ok) {
        const data = await res.json();
        setFounders(data);
      } else {
        setFounders(MOCK_DATA.founders);
      }
    } catch (error) {
      console.error('Error refetching founders:', error);
      setFounders(MOCK_DATA.founders);
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn, loginAdmin, logoutAdmin,
      settings, updateSettings,
      founders, setFounders, addFounder, updateFounder, deleteFounder,
      blogs, setBlogs, addBlog, updateBlog, deleteBlog,
      gallery, addGalleryItem, deleteGalleryItem,
      careers, addCareer, updateCareer, deleteCareer,
      messages, setMessages, fetchMessages, markMessageAsRead, deleteMessage,
      growthStats, updateGrowthStat,
      loading,
      refetchFounders,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
