import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Founder, BlogPost, GalleryItem, CareerPost, SiteSettings, GrowthStat,
  defaultBlogs, defaultGallery, defaultCareers,
  defaultSettings, defaultGrowthStats
} from '../data/store';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3001/api';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => void;
  founders: Founder[];
  setFounders: (f: Founder[]) => void;
  addFounder: (f: Omit<Founder, 'id'>) => Promise<void>;
  updateFounder: (id: number, f: Partial<Founder>) => Promise<void>;
  deleteFounder: (id: number) => Promise<void>;
  blogs: BlogPost[];
  setBlogs: (b: BlogPost[]) => void;
  addBlog: (b: Omit<BlogPost, 'id'>) => void;
  updateBlog: (id: number, b: Partial<BlogPost>) => void;
  deleteBlog: (id: number) => void;
  gallery: GalleryItem[];
  addGalleryItem: (g: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: number) => void;
  careers: CareerPost[];
  addCareer: (c: Omit<CareerPost, 'id'>) => void;
  updateCareer: (id: number, c: Partial<CareerPost>) => void;
  deleteCareer: (id: number) => void;
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
  
  // Settings, blogs, gallery, careers still use localStorage
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('tasnim_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('tasnim_blogs');
    return saved ? JSON.parse(saved) : defaultBlogs;
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('tasnim_gallery');
    return saved ? JSON.parse(saved) : defaultGallery;
  });
  const [careers, setCareers] = useState<CareerPost[]>(() => {
    const saved = localStorage.getItem('tasnim_careers');
    return saved ? JSON.parse(saved) : defaultCareers;
  });
  const [growthStats, setGrowthStats] = useState<GrowthStat[]>(() => {
    const saved = localStorage.getItem('tasnim_growth');
    return saved ? JSON.parse(saved) : defaultGrowthStats;
  });

  // Founders now fetched from backend (no localStorage)
  const [founders, setFounders] = useState<Founder[]>([]);

  // Fetch founders from backend on mount
  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/founders`);
      if (!response.ok) {
        throw new Error('Failed to fetch founders');
      }
      const data = await response.json();
      setFounders(data);
    } catch (error) {
      console.error('Error fetching founders:', error);
      alert('Failed to load founders from server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // localStorage for other data (not founders)
  useEffect(() => { localStorage.setItem('tasnim_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('tasnim_blogs', JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem('tasnim_gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem('tasnim_careers', JSON.stringify(careers)); }, [careers]);
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

  const updateSettings = (s: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
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
  // OTHER DATA - Still using localStorage
  // ═══════════════════════════════════════════════════════

  const addBlog = (b: Omit<BlogPost, 'id'>) => {
    const newId = Math.max(0, ...blogs.map(x => x.id)) + 1;
    setBlogs(prev => [...prev, { ...b, id: newId }]);
  };

  const updateBlog = (id: number, b: Partial<BlogPost>) => {
    setBlogs(prev => prev.map(x => x.id === id ? { ...x, ...b } : x));
  };

  const deleteBlog = (id: number) => {
    setBlogs(prev => prev.filter(x => x.id !== id));
  };

  const addGalleryItem = (g: Omit<GalleryItem, 'id'>) => {
    const newId = Math.max(0, ...gallery.map(x => x.id)) + 1;
    setGallery(prev => [...prev, { ...g, id: newId }]);
  };

  const deleteGalleryItem = (id: number) => {
    setGallery(prev => prev.filter(x => x.id !== id));
  };

  const addCareer = (c: Omit<CareerPost, 'id'>) => {
    const newId = Math.max(0, ...careers.map(x => x.id)) + 1;
    setCareers(prev => [...prev, { ...c, id: newId }]);
  };

  const updateCareer = (id: number, c: Partial<CareerPost>) => {
    setCareers(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  };

  const deleteCareer = (id: number) => {
    setCareers(prev => prev.filter(x => x.id !== id));
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
