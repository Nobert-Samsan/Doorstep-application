import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import WorkerLayout from './components/layout/WorkerLayout';

// Public Pages
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import SearchResults from './pages/public/SearchResults';
import HowItWorks from './pages/public/HowItWorks';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AccountType from './pages/auth/AccountType';
import CustomerRegister from './pages/auth/CustomerRegister';
import WorkerRegister from './pages/auth/WorkerRegister';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import FindWorkers from './pages/customer/FindWorkers';
import CategoryService from './pages/customer/CategoryService';
import WorkerProfile from './pages/customer/WorkerProfile';
import PostJob from './pages/customer/PostJob';
import MyBookings from './pages/customer/MyBookings';
import BookingDetail from './pages/customer/BookingDetail';
import BookWorker from './pages/customer/BookWorker';
import Notifications from './pages/customer/Notifications';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';
import JobRequests from './pages/worker/JobRequests';
import MyJobs from './pages/worker/MyJobs';
import WorkerJobDetail from './pages/worker/WorkerJobDetail';
import Earnings from './pages/worker/Earnings';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import WorkerApprovals from './pages/admin/WorkerApprovals';
import UserManagement from './pages/admin/UserManagement';
import Categories from './pages/admin/Categories';
import Disputes from './pages/admin/Disputes';

// Shared Pages
import Chat from './pages/shared/Chat';
import Settings from './pages/shared/Settings';

import { useAuthStore } from './store/authStore';
import api from './services/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
};

function App() {
  const { token, user, setUser, logout } = useAuthStore();

  React.useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => logout());
    }
  }, [token, user, setUser, logout]);

  // Don't render routes until user is loaded if we have a token
  if (token && !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/register/worker" element={<WorkerRegister />} />
        
        <Route element={<AuthLayout />}>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<AccountType />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="category/:categoryName" element={<CategoryService />} />
          <Route path="find-workers" element={<FindWorkers />} />
          <Route path="worker/:id" element={<WorkerProfile />} />
          <Route path="book/:id" element={<BookWorker />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="messages" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Worker Routes */}
        <Route path="/worker" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="activities" element={<MyJobs />} />
          <Route path="jobs/:id" element={<WorkerJobDetail />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<WorkerApprovals />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="categories" element={<Categories />} />
          <Route path="disputes" element={<Disputes />} />
        </Route>

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
