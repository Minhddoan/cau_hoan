import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage }     from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage }  from './pages/ProductsPage';
import { ServicesPage }  from './pages/ServicesPage';
import { GalleryPage }   from './pages/GalleryPage';
import { ArticlesPage }  from './pages/ArticlesPage';
import { FaqsPage }      from './pages/FaqsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { BookingsPage }  from './pages/BookingsPage';
import { JobsPage }      from './pages/JobsPage';
import { UsersPage }     from './pages/UsersPage';
import { SettingsPage }  from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141418',
              color: '#E8E8F0',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.8rem',
            },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="products"     element={<ProductsPage />} />
            <Route path="services"     element={<ServicesPage />} />
            <Route path="gallery"      element={<GalleryPage />} />
            <Route path="articles"     element={<ArticlesPage />} />
            <Route path="faqs"         element={<FaqsPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="bookings"     element={<BookingsPage />} />
            <Route path="jobs"         element={<JobsPage />} />
            <Route path="users"        element={<UsersPage />} />
            <Route path="settings"     element={<SettingsPage />} />
            <Route path="audit-logs"   element={<AuditLogsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
