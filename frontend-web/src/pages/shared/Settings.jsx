import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { User, Shield, Bell, CreditCard, Info, ChevronRight } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notifications State
  const [notificationPrefs, setNotificationPrefs] = useState({
    sms: true,
    email: true,
    push: true
  });

  // Initialize form with real user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
      });
      if (user.notificationsPreferences) {
        setNotificationPrefs(user.notificationsPreferences);
      }
    }
  }, [user]);

  const handleNotificationToggle = async (field) => {
    const newPrefs = { ...notificationPrefs, [field]: !notificationPrefs[field] };
    setNotificationPrefs(newPrefs);
    
    try {
      const { data } = await api.put(`/${user?.role || 'customer'}/notification-preferences`, newPrefs);
      setUser(data.data); // Update global state
    } catch (err) {
      console.error(err);
      alert('Failed to update notification preferences');
      // Revert on error
      setNotificationPrefs({ ...notificationPrefs, [field]: notificationPrefs[field] });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent typing letters in phone number field
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^\d+]/g, '');
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleSavePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!passwordData.currentPassword) {
      return setPasswordError("Please enter your current password");
    }
    if (passwordData.newPassword.length < 6) {
      return setPasswordError("New password must be at least 6 characters long");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError("New passwords do not match");
    }
    
    setIsSavingPassword(true);
    try {
      await api.put(`/${user?.role || 'customer'}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePhoto', file);

    setIsUploadingPhoto(true);
    try {
      const { data } = await api.put(`/${user?.role || 'customer'}/profile/photo`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data.data); // Updates global state and instantly re-renders photo
      alert('Photo updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put(`/${user?.role || 'customer'}/profile`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      // Update global zustand store with new user data
      setUser(data.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      if (window.confirm("FINAL WARNING: All your data, bookings, and history will be permanently erased. Proceed?")) {
        try {
          await api.delete(`/${user?.role || 'customer'}/profile`);
          alert('Your account has been successfully deleted.');
          // Use the global logout to clear token and user state, which will automatically redirect to /login
          useAuthStore.getState().logout(); 
          window.location.href = '/login';
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.message || 'Failed to delete account');
        }
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>
      
      <div className="flex flex-col md:flex-row bg-transparent md:bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-200 md:overflow-hidden">
        {/* Sidebar / Tabs */}
        <div className={`w-full md:w-64 md:bg-gray-50 border-transparent md:border-r md:border-gray-200 ${!showMobileMenu ? 'hidden md:block' : 'block'}`}>
          <nav className="flex flex-col p-2 md:p-0 md:py-4 gap-3 md:gap-0">
            <button 
              onClick={() => { setActiveTab('profile'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'profile' && !showMobileMenu ? 'md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-700 md:hidden" />
                <span>Profile Information</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('security'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'security' && !showMobileMenu ? 'md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-700 md:hidden" />
                <span>Password & Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('notifications'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'notifications' && !showMobileMenu ? 'md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-700 md:hidden" />
                <span>Notification Preferences</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('payments'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'payments' && !showMobileMenu ? 'md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-700 md:hidden" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'about' && !showMobileMenu ? 'md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Info size={20} className="text-gray-700 md:hidden" />
                <span>About & Support</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-4 md:p-8 bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${showMobileMenu ? 'hidden md:block' : 'block'}`}>
          <button 
            className="md:hidden flex items-center text-primary mb-6 text-sm font-medium hover:underline"
            onClick={() => setShowMobileMenu(true)}
          >
            ← Back to Settings
          </button>
          
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
              <div className="flex items-center gap-6 mb-8">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full border-2 border-primary object-cover" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-primary flex items-center justify-center font-bold text-3xl text-gray-500">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  <button onClick={() => fileInputRef.current.click()} disabled={isUploadingPhoto} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
                    {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  {user?.pendingEmail && <p className="text-xs text-warning mb-1">Pending verification: {user.pendingEmail}</p>}
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    type="email" 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" 
                  />
                  <p className="text-xs text-primary mt-1 cursor-pointer hover:underline" onClick={async () => {
                    if (!formData.email || formData.email === user.email) return alert('Please enter a new email first');
                    try {
                      await api.post(`/${user?.role || 'customer'}/profile/request-email-change`, { email: formData.email });
                      alert('Check your new email address for the confirmation link!');
                    } catch (err) {
                      alert(err.response?.data?.message || 'Failed to request email change');
                    }
                  }}>
                    Send Verification Email
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="mt-8">
                <button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-secondary disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>
              <div className="space-y-4 max-w-md">
                
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 mb-4">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 mb-4">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} type="password" placeholder="••••••••" className={`w-full border ${passwordError?.includes('current') || passwordError?.includes('Incorrect') ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'} rounded px-3 py-2 focus:outline-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded px-3 py-2 focus:border-primary focus:outline-none" />
                </div>
                <div className="pt-2">
                  <button onClick={handleSavePassword} disabled={isSavingPassword} className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-secondary disabled:opacity-50">
                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-danger">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={handleDeleteAccount} className="border border-danger text-danger px-4 py-2 rounded hover:bg-red-50 font-medium transition-colors">Delete Account</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Email & SMS Notifications</h3>
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-800">Job Updates</h4>
                    <p className="text-sm text-gray-500">Receive SMS when a job status changes.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notificationPrefs.sms} onChange={() => handleNotificationToggle('sms')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-800">New Messages</h4>
                    <p className="text-sm text-gray-500">Receive email when you get a new chat message.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notificationPrefs.email} onChange={() => handleNotificationToggle('email')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium text-gray-800">Marketing & Promos</h4>
                    <p className="text-sm text-gray-500">Receive emails about new features and discounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notificationPrefs.push} onChange={() => handleNotificationToggle('push')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Payment Methods</h3>
                <button onClick={() => alert('Stripe integration pending')} className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add New Card
                </button>
              </div>

              <div className="space-y-4 max-w-2xl">
                {/* Mock Saved Card */}
                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-primary transition-colors cursor-pointer bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-bold font-serif italic">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/28</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">Default</span>
                    <button className="text-gray-400 hover:text-danger p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3 border border-blue-100">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p>Payments are securely processed by Stripe. We do not store your full credit card information on our servers.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="animate-fadeIn max-w-3xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6">About Doorstep</h3>
              
              <div className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-100">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Doorstep is Sri Lanka's premier home service marketplace, connecting trusted local professionals with customers who need reliable help. From plumbing to electrical work, we ensure quality and transparency at every step.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Contact Us</h4>
                    <p className="text-sm text-gray-600 mb-1">Email: support@doorstep.lk</p>
                    <p className="text-sm text-gray-600 mb-1">Phone: +94 11 234 5678</p>
                    <p className="text-sm text-gray-600">Address: 123 Galle Road, Colombo 03</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Follow Us</h4>
                    <div className="flex gap-4">
                      <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Terms and Conditions</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
                
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Privacy Policy</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
