import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Founder, BlogPost, GalleryItem, CareerPost, SiteSettings, GrowthStat, ContactMessage, GrowthJourney,
  defaultSettings, defaultGrowthStats, defaultGrowthJourney
} from '../data/store';

// Backend API base URL
const getApiUrl = () => {
  // In development with Vite proxy, use relative path
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production, use the full API URL from environment variable
  return import.meta.env.VITE_API_URL || 'https://tasnim-dairy-farm-backend.onrender.com/api';
};

export const API_BASE_URL = getApiUrl();

// Secure token management
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) {
    return null;
  }
  
  // Check if token is expired
  if (new Date().getTime() > parseInt(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  
  return token;
};

const setStoredToken = (token: string, expiresIn: string) => {
  const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem('tasnim_admin'); // Remove old admin flag
};

// Secure API call helper with authentication
const secureApiCall = async (url: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle token expiry
  if (response.status === 401 || response.status === 403) {
    removeStoredToken();
    window.location.reload(); // Force re-authentication
  }
  
  return response;
};

// Helper function for safe JSON parsing
const safeJsonParse = async (response: Response) => {
  try {
    return await response.json();
  } catch (parseError) {
    console.error('Failed to parse response as JSON:', parseError);
    throw new Error('Server returned invalid response format');
  }
};
// Helper function for safe error handling
const handleResponseError = async (response: Response, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  try {
    const errorResponse = await response.text();
    try {
      const errorJson = JSON.parse(errorResponse);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      errorMessage = errorResponse || response.statusText || errorMessage;
    }
  } catch {
    errorMessage = response.statusText || errorMessage;
  }
  throw new Error(errorMessage);
};

interface AdminContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
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
  growthJourney: GrowthJourney[];
  setGrowthJourney: (g: GrowthJourney[]) => void;
  addGrowthJourney: (g: Omit<GrowthJourney, 'id'>) => Promise<void>;
  updateGrowthJourney: (id: number, g: Partial<GrowthJourney>) => Promise<void>;
  deleteGrowthJourney: (id: number) => Promise<void>;
  fetchGrowthJourney: () => Promise<void>;
  growthStats: GrowthStat[];
  updateGrowthStat: (index: number, stat: Partial<GrowthStat>) => void;
  loading: boolean;
  refetchFounders: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return getStoredToken() !== null;
  });
  const [loading, setLoading] = useState(false);
  
  // All data now fetched from backend (no localStorage)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [growthJourney, setGrowthJourney] = useState<GrowthJourney[]>(defaultGrowthJourney);
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

      const [foundersRes, blogsRes, galleryRes, careersRes, settingsRes, messagesRes, growthRes] = await Promise.all([
        safeFetch(`${API_BASE_URL}/founders`),
        safeFetch(`${API_BASE_URL}/blogs`),
        safeFetch(`${API_BASE_URL}/gallery`),
        safeFetch(`${API_BASE_URL}/careers`),
        safeFetch(`${API_BASE_URL}/settings`),
        safeFetch(`${API_BASE_URL}/contact/messages`),
        safeFetch(`${API_BASE_URL}/growth`),
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
      
      if (growthRes) setGrowthJourney(await growthRes.json());
      else setGrowthJourney(defaultGrowthJourney);
      
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

  const loginAdmin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          setStoredToken(data.token, data.expiresIn);
          setIsAdminLoggedIn(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    removeStoredToken();
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
        await handleResponseError(response, 'Failed to add founder');
      }

      const newFounder = await safeJsonParse(response);
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
        let errorMessage = 'Failed to update founder';
        try {
          const errorResponse = await response.text();
          // Try to parse as JSON first
          try {
            const errorJson = JSON.parse(errorResponse);
            errorMessage = errorJson.error || errorMessage;
          } catch {
            // If not JSON, use the text response or status text
            errorMessage = errorResponse || response.statusText || errorMessage;
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let updated;
      try {
        updated = await safeJsonParse(response);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response format');
      }
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
        await handleResponseError(response, 'Failed to delete founder');
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

      if (!response.ok) {
        await handleResponseError(response, 'Failed to add blog');
      }

      const newBlog = await safeJsonParse(response);
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

      if (!response.ok) {
        await handleResponseError(response, 'Failed to update blog');
      }

      const updated = await safeJsonParse(response);
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

  const fetchGrowthJourney = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/growth`);
      if (res.ok) {
        const data = await res.json();
        setGrowthJourney(data);
      }
    } catch (error) {
      console.error('Error fetching growth journey:', error);
    }
  };

  const addGrowthJourney = async (item: Omit<GrowthJourney, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/growth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        await handleResponseError(response, 'Failed to add growth journey item');
      }

      const newItem = await response.json();
      setGrowthJourney(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding growth journey item:', error);
      alert('Failed to add growth journey item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGrowthJourney = async (id: number, item: Partial<GrowthJourney>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/growth/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        await handleResponseError(response, 'Failed to update growth journey item');
      }

      const updated = await response.json();
      setGrowthJourney(prev => prev.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error('Error updating growth journey item:', error);
      alert('Failed to update growth journey item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGrowthJourney = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/growth/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete growth journey item');

      setGrowthJourney(prev => prev.filter(x => x.id !== id));
    } catch (error) {
      console.error('Error deleting growth journey item:', error);
      alert('Failed to delete growth journey item');
      throw error;
    } finally {
      setLoading(false);
    }
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
      growthJourney, setGrowthJourney, addGrowthJourney, updateGrowthJourney, deleteGrowthJourney, fetchGrowthJourney,
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
