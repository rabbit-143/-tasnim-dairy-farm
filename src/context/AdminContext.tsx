import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Founder, BlogPost, GalleryItem, CareerPost, SiteSettings, GrowthStat, ContactMessage,
  defaultSettings, defaultGrowthStats
} from '../data/store';

// Backend API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
      
      // Fetch all data in parallel
      const [foundersRes, blogsRes, galleryRes, careersRes, settingsRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/founders`),
        fetch(`${API_BASE_URL}/blogs`),
        fetch(`${API_BASE_URL}/gallery`),
        fetch(`${API_BASE_URL}/careers`),
        fetch(`${API_BASE_URL}/settings`),
        fetch(`${API_BASE_URL}/contact/messages`),
      ]);

      if (foundersRes.ok) setFounders(await foundersRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (careersRes.ok) setCareers(await careersRes.json());
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData); // It's already a single object
      }
      if (messagesRes.ok) setMessages(await messagesRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data from server. Make sure backend is running.');
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
