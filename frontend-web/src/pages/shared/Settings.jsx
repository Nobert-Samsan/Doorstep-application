import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { User, Shield, Bell, CreditCard, Info, ChevronRight, Check, ArrowLeft, Pencil, ExternalLink, Globe, MapPin, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editingSection, setEditingSection] = useState(null); // null | 'name' | 'gender' | 'phone' | 'email' | 'language' | 'address'
  const [securitySection, setSecuritySection] = useState(null); // null | 'password' | 'delete'
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    email: '',
    preferredLanguage: 'en',
    streetAddress: '',
    city: '',
    district: ''
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
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);

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
        gender: user.gender || '',
        phone: user.phone || '',
        email: user.email || '',
        preferredLanguage: user.preferredLanguage || 'en',
        streetAddress: user.streetAddress || '',
        city: user.city || '',
        district: user.district || ''
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
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSecuritySection(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update password';
      setPasswordError(msg);
      toast.error(msg);
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
      setUser(data.data);
      toast.success('Photo updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUpdateSection = async (sectionName) => {
    setIsSaving(true);
    try {
      let payload = {};
      if (sectionName === 'name') {
        if (!formData.firstName.trim()) {
          toast.error('First name is required');
          setIsSaving(false);
          return;
        }
        payload = { 
          firstName: formData.firstName.trim(), 
          lastName: formData.lastName.trim() 
        };
      } else if (sectionName === 'phone') {
        if (!formData.phone.trim()) {
          toast.error('Phone number is required');
          setIsSaving(false);
          return;
        }
        payload = { phone: formData.phone.trim() };
      } else if (sectionName === 'gender') {
        if (!formData.gender) {
          toast.error('Please select a gender');
          setIsSaving(false);
          return;
        }
        payload = { gender: formData.gender };
      } else if (sectionName === 'email') {
        if (!formData.email.trim()) {
          toast.error('Email address is required');
          setIsSaving(false);
          return;
        }
        payload = { email: formData.email.trim() };
      } else if (sectionName === 'language') {
        payload = { preferredLanguage: formData.preferredLanguage || 'en' };
      } else if (sectionName === 'address') {
        payload = {
          streetAddress: formData.streetAddress?.trim() || '',
          city: formData.city?.trim() || '',
          district: formData.district?.trim() || ''
        };
      }

      const { data } = await api.put(`/${user?.role || 'customer'}/profile`, payload);
      setUser(data.data);
      toast.success('Updated successfully!');
      setEditingSection(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDeleteChecked) {
      toast.error("Please confirm by checking the box before proceeding");
      return;
    }
    if (window.confirm("FINAL WARNING: All your data, bookings, and history will be permanently erased. Proceed?")) {
      setIsDeletingAccount(true);
      try {
        await api.delete(`/${user?.role || 'customer'}/profile`);
        toast.success('Your account has been successfully deleted.');
        // Use the global logout to clear token and user state, which will automatically redirect to /login
        useAuthStore.getState().logout(); 
        window.location.href = '/login';
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to delete account');
      } finally {
        setIsDeletingAccount(false);
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
              onClick={() => { setActiveTab('profile'); setEditingSection(null); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'profile' ? 'bg-amber-50 md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-700 md:hidden" />
                <span>Personal info</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('security'); setSecuritySection(null); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'security' ? 'bg-amber-50 md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-700 md:hidden" />
                <span>Password & Security</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('notifications'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'notifications' ? 'bg-amber-50 md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-700 md:hidden" />
                <span>Notification Preferences</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('payments'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'payments' ? 'bg-amber-50 md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-gray-700 md:hidden" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
            <button 
              onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}
              className={`flex items-center justify-between text-left px-5 py-4 md:px-6 md:py-4 font-medium transition-colors bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${activeTab === 'about' ? 'bg-amber-50 md:bg-amber-50 md:border-l-4 border-primary text-primary' : 'hover:bg-gray-50 md:hover:bg-gray-100 text-gray-800 md:text-gray-700 md:border-l-4 md:border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Info size={20} className="text-gray-700 md:hidden" />
                <span>About Us</span>
              </div>
              <ChevronRight size={20} className="text-gray-400 md:hidden" />
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-4 md:p-8 bg-white rounded-xl md:rounded-none shadow-sm md:shadow-none ${showMobileMenu ? 'hidden md:block' : 'block'}`}>
          <button 
            className="flex items-center text-primary mb-6 text-sm font-medium hover:underline"
            onClick={() => {
              if (editingSection) {
                setEditingSection(null);
              } else if (securitySection) {
                setSecuritySection(null);
              } else {
                setShowMobileMenu(true);
              }
            }}
          >
            ← Back
          </button>





          
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              {editingSection ? (
                /* DRILL-DOWN / UPDATE SECTION VIEW (Matches Screenshot 3) */
                <div className="max-w-xl">








                  {/* PHONE NUMBER EDIT */}
                  {editingSection === 'phone' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Phone number</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        You'll use this number to get notifications, sign in, and recover your account.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Phone number</label>
                          <div className="flex gap-3">
                            <div className="bg-[#F3F4F6] rounded-xl px-4 py-3 flex items-center gap-2 text-gray-900 font-semibold text-sm shrink-0 select-none">
                              <span>LK</span>
                              <span className="text-xs text-gray-500">▼</span>
                            </div>
                            <input 
                              type="text" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+94 77 123 4567"
                              className="bg-[#F3F4F6] rounded-xl px-4 py-3 flex-1 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">A verification code will be sent to this number</p>
                        </div>

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('phone')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NAME EDIT */}
                  {editingSection === 'name' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Name</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        This is the name that will appear on your DoorStep profile, bookings, and messages.
                      </p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">First name</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Last name</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                          />
                        </div>

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('name')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GENDER EDIT */}
                  {editingSection === 'gender' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Gender</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        Select your gender to help us personalize your account and service experience.
                      </p>

                      <div className="space-y-3">
                        {[
                          { value: 'male', label: 'Male' },
                          { value: 'female', label: 'Female' },
                          { value: 'other', label: 'Other' }
                        ].map(g => (
                          <label 
                            key={g.value}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                              formData.gender === g.value 
                                ? 'border-black bg-gray-50/80 shadow-xs' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="font-semibold text-gray-900 text-sm">{g.label}</span>
                            <input 
                              type="radio" 
                              name="gender" 
                              value={g.value}
                              checked={formData.gender === g.value}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              className="w-4 h-4 text-black accent-black focus:ring-black"
                            />
                          </label>
                        ))}

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('gender')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EMAIL EDIT */}
                  {editingSection === 'email' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Email</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        We'll send booking notifications, receipts, and important account updates to this email address.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name@example.com"
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                          />
                          <p className="text-xs text-gray-500 mt-2">A confirmation notice may be sent to verify changes</p>
                        </div>

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('email')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LANGUAGE EDIT */}
                  {editingSection === 'language' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Language</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        Select your preferred language for the Doorstep application interface and communication.
                      </p>

                      <div className="space-y-3">
                        {[
                          { code: 'en', label: 'English (US)' },
                          { code: 'si', label: 'Sinhala (සිංහල)' },
                          { code: 'ta', label: 'Tamil (தமிழ்)' }
                        ].map(lang => (
                          <label 
                            key={lang.code}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                              (formData.preferredLanguage || 'en') === lang.code 
                                ? 'border-black bg-gray-50/80 shadow-xs' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className="font-semibold text-gray-900 text-sm">{lang.label}</span>
                            <input 
                              type="radio" 
                              name="preferredLanguage" 
                              value={lang.code}
                              checked={(formData.preferredLanguage || 'en') === lang.code}
                              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                              className="w-4 h-4 text-black accent-black focus:ring-black"
                            />
                          </label>
                        ))}

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('language')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADDRESS EDIT */}
                  {editingSection === 'address' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Address</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        Your default address helps us locate nearby verified professionals and estimate arrival times.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Street address</label>
                          <input 
                            type="text" 
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            placeholder="e.g. 123 Main Street"
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                            <input 
                              type="text" 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="e.g. Jaffna"
                              className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">District</label>
                            <input 
                              type="text" 
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              placeholder="e.g. Jaffna"
                              className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium"
                            />
                          </div>
                        </div>

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleUpdateSection('address')}
                            disabled={isSaving}
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSaving ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingSection(null)}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MAIN PERSONAL INFO LIST VIEW (Matches Screenshot 2) */
                <div className="max-w-2xl">
                  <h2 className="text-[28px] md:text-[32px] font-bold text-black tracking-tight mb-8">Personal info</h2>

                  {/* Profile Avatar with Pencil Icon */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 mb-10">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#52525B] text-white flex items-center justify-center overflow-hidden shadow-inner">
                      {user?.profilePhoto ? (
                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={44} className="text-white opacity-90" />
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={isUploadingPhoto}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all"
                      title="Update photo"
                    >
                      <Pencil size={13} className="text-gray-700" />
                    </button>
                  </div>

                  {/* Information Rows with Dividers */}
                  <div className="divide-y divide-gray-100">
                    {/* Name */}
                    <div 
                      onClick={() => setEditingSection('name')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Name</div>
                        <div className="text-[15px] text-gray-600">
                          {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Add your name'}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Gender */}
                    <div 
                      onClick={() => setEditingSection('gender')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Gender</div>
                        <div className="text-[15px] text-gray-600 capitalize">
                          {user?.gender ? (user.gender === 'other' ? 'Other' : user.gender) : 'Select gender'}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Phone number */}
                    <div 
                      onClick={() => setEditingSection('phone')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Phone number</div>
                        <div className="flex items-center gap-2 text-[15px] text-gray-600">
                          <span>{user?.phone || 'Add phone number'}</span>
                          {user?.phone && (
                            <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Email */}
                    <div 
                      onClick={() => setEditingSection('email')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Email</div>
                        <div className="flex items-center gap-2 text-[15px] text-gray-600">
                          <span>{user?.email || 'Add email'}</span>
                          {user?.email && (
                            <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Language */}
                    <div 
                      onClick={() => setEditingSection('language')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Language</div>
                        <div className="text-[15px] text-gray-600">
                          {user?.preferredLanguage === 'ta' ? 'Tamil' : user?.preferredLanguage === 'si' ? 'Sinhala' : 'Update device language'}
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Address */}
                    <div 
                      onClick={() => setEditingSection('address')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Address</div>
                        <div className="text-[15px] text-gray-600">
                          {[user?.streetAddress, user?.city, user?.district].filter(Boolean).join(', ') || 'Add your address'}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fadeIn">
              {securitySection ? (
                /* DRILL-DOWN / UPDATE SECURITY SECTION VIEW */
                <div className="max-w-xl">








                  {/* UPDATE PASSWORD DRILL-DOWN */}
                  {securitySection === 'password' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Update password</h2>
                      <p className="text-[15px] text-gray-600 mb-8 leading-relaxed">
                        Ensure your account is using a strong, unique password to stay protected.
                      </p>

                      {passwordError && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 mb-6">
                          {passwordError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Current password</label>
                          <input 
                            name="currentPassword" 
                            value={passwordData.currentPassword} 
                            onChange={handlePasswordInputChange} 
                            type="password" 
                            placeholder="Enter current password" 
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" 
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">New password</label>
                          <input 
                            name="newPassword" 
                            value={passwordData.newPassword} 
                            onChange={handlePasswordInputChange} 
                            type="password" 
                            placeholder="Enter new password (min. 6 characters)" 
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" 
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm new password</label>
                          <input 
                            name="confirmPassword" 
                            value={passwordData.confirmPassword} 
                            onChange={handlePasswordInputChange} 
                            type="password" 
                            placeholder="Re-enter new password" 
                            className="bg-[#F3F4F6] rounded-xl px-4 py-3 w-full text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" 
                          />
                        </div>

                        <div className="pt-6 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={handleSavePassword} 
                            disabled={isSavingPassword} 
                            className="bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            {isSavingPassword ? 'Updating...' : 'Update'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setSecuritySection(null); setPasswordError(''); }}
                            className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DELETE ACCOUNT DRILL-DOWN */}
                  {securitySection === 'delete' && (
                    <div>
                      <h2 className="text-[32px] font-bold text-black tracking-tight mb-2">Delete account</h2>
                      <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                        Permanently close your DoorStep account and remove your profile information.
                      </p>

                      <div className="bg-red-50/60 border border-red-200 rounded-2xl p-5 mb-6 text-red-900">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                          <div className="space-y-1 text-sm leading-relaxed">
                            <p className="font-semibold text-red-950">This action cannot be undone</p>
                            <p className="text-red-800">
                              Once deleted, all your active and previous bookings, reviews, payment methods, saved addresses, and profile details will be permanently removed.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#F3F4F6] rounded-xl border border-transparent hover:border-gray-300 transition-colors">
                          <input 
                            type="checkbox"
                            checked={confirmDeleteChecked}
                            onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
                            className="mt-1 w-4 h-4 text-red-600 accent-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-800 font-medium">
                            I understand that deleting my account is irreversible and all my data will be permanently wiped.
                          </span>
                        </label>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={!confirmDeleteChecked || isDeletingAccount}
                          className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-red-700 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isDeletingAccount ? 'Deleting...' : 'Delete account'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setSecuritySection(null); setConfirmDeleteChecked(false); }}
                          className="px-5 py-3 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MAIN PASSWORD & SECURITY LIST VIEW */
                <div className="max-w-2xl">
                  <h2 className="text-[28px] md:text-[32px] font-bold text-black tracking-tight mb-8">Password & security</h2>

                  <div className="divide-y divide-gray-100">
                    {/* Update password */}
                    <div 
                      onClick={() => setSecuritySection('password')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Update password</div>
                        <div className="text-[15px] text-gray-600">
                          Change your login password to keep your account safe
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>

                    {/* Delete account */}
                    <div 
                      onClick={() => setSecuritySection('delete')}
                      className="py-5 flex items-center justify-between cursor-pointer group hover:bg-gray-50/70 -mx-4 px-4 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="text-[15px] font-semibold text-gray-900">Delete account</div>
                        <div className="text-[15px] text-gray-600">
                          Permanently delete your account and all associated data
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                    </div>
                  </div>
                </div>
              )}
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
 
