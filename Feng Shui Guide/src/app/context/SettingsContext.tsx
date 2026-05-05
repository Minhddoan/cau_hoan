import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  site_logo?: string;
  hero_banner?: string;
  about_banner?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  facebook_url?: string;
  youtube_url?: string;
  zalo_link?: string;
  booking_enabled?: string;
  ai_chat_enabled?: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  getAssetUrl: (path: string | undefined) => string;
  isBookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/api';
const UPLOADS_URL = (import.meta as any).env.VITE_UPLOADS_URL || 'http://localhost:4000/uploads';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const result = await response.json();
        if (result.success && result.grouped) {
          // Flatten or use grouped. We'll flatten for easier access
          const flat: SiteSettings = {};
          result.data.forEach((item: any) => {
            (flat as any)[item.key] = item.value;
          });
          setSettings(flat);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const getAssetUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${UPLOADS_URL}/${path}`;
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, loading, getAssetUrl, 
      isBookingOpen, setBookingOpen, 
      isLoginOpen, setLoginOpen 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
