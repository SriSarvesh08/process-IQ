import React, { useState, useContext } from 'react';
import { 
  User, Shield, Bell, CreditCard, Save, AlertTriangle 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const ToggleRow = ({ label, description, checked, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
      <div style={{ paddingRight: '1rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1F36', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, marginTop: '2px' }}>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          position: 'relative', display: 'inline-flex', height: '24px', width: '44px', flexShrink: 0, cursor: 'pointer', borderRadius: '9999px', border: '2px solid transparent',
          transition: 'background-color 0.2s',
          backgroundColor: checked ? '#2563EB' : '#CBD5E1',
          outline: 'none'
        }}
      >
        <span
          style={{
            pointerEvents: 'none', display: 'inline-block', height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            transform: checked ? 'translateX(20px)' : 'translateX(0)'
          }}
        />
      </button>
    </div>
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      toast.loading('Initializing payment...', { id: 'payment' });
      const token = localStorage.getItem('token');
      
      const orderRes = await axios.post('http://localhost:5001/api/payment/create-order', 
        { amount: 999, currency: 'INR', plan: 'Pro' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: 'rzp_live_T1Bq1O0XXbTu63', // Razorpay key from backend .env
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'ProcessIQ',
        description: 'Upgrade to Pro Plan',
        order_id: orderRes.data.id,
        handler: async function (response) {
          toast.loading('Verifying payment...', { id: 'payment' });
          try {
            await axios.post('http://localhost:5001/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Payment successful! Upgraded to Pro.', { id: 'payment' });
          } catch (err) {
            toast.error('Payment verification failed.', { id: 'payment' });
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#2563EB' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      toast.dismiss('payment');
    } catch (err) {
      toast.error('Failed to create order.', { id: 'payment' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }} 
      className="w-full h-full p-8"
      style={{ 
        background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)',
        minHeight: '100vh',
        marginLeft: '-1rem', // Adjust for app-content padding if needed
        marginRight: '-1rem',
        marginTop: '-1.5rem',
        padding: '3rem 4rem'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1A1F36', marginBottom: '0.5rem' }}>Account Settings</h1>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>Manage your profile, security, notifications, and billing.</p>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Navigation Sidebar */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: '6rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200"
                  style={{ 
                    backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                    color: activeTab === tab.id ? '#1A1F36' : '#64748B',
                    border: activeTab === tab.id ? '1px solid #E2E8F0' : '1px solid transparent',
                    boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    outline: 'none', cursor: 'pointer'
                  }}
                >
                  <tab.icon size={18} style={{ color: activeTab === tab.id ? '#3B82F6' : '#94A3B8' }} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1" style={{ maxWidth: '700px' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  
                  {/* Profile Information Card */}
                  <div className="card mb-6 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                    <h2 className="text-lg font-bold mb-6 text-gray-900">Profile Information</h2>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div style={{ 
                        width: '64px', height: '64px', borderRadius: '50%', 
                        backgroundColor: '#3B82F6', color: 'white', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '1.5rem', fontWeight: '600' 
                      }}>
                        {user?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Profile picture is generated from your initials.</p>
                        <p className="text-sm text-gray-500">Email: <span className="font-mono text-gray-900">{user?.email || 'officialsolo93@gmail.com'}</span></p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSave}>
                      <div className="grid-cols-2 mb-6 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#1A1F36', fontSize: '0.875rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                            defaultValue={user?.name || 'Sri Sarvesh B'} 
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#64748B', backgroundColor: '#F8FAFC', fontSize: '0.875rem', cursor: 'not-allowed', boxSizing: 'border-box' }}
                            defaultValue={user?.email || 'officialsolo93@gmail.com'} 
                            readOnly 
                          />
                          <p className="text-xs text-gray-400 mt-2">Email cannot be changed.</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea 
                          style={{ width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#1A1F36', fontSize: '0.875rem', backgroundColor: '#FFFFFF', minHeight: '120px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          placeholder="Tell us a little about yourself..."
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        ></textarea>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          style={{ padding: '0.6rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Danger Zone Card */}
                  <div className="card shadow-sm" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid #FECACA' }}>
                    <h2 className="text-lg font-bold mb-2 text-red-600">Danger Zone</h2>
                    <p className="text-sm text-gray-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                    
                    <button 
                      type="button" 
                      style={{ padding: '0.6rem 1.5rem', backgroundColor: '#FFFFFF', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      onClick={() => toast.error('Account deletion disabled in demo environment.')}
                    >
                      Delete Account
                    </button>
                  </div>

                </motion.div>
              )}

              {/* Billing Tab Content */}
              {activeTab === 'billing' && (
                <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <div className="card shadow-sm mb-6" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                    <h2 className="text-lg font-bold mb-2" style={{ color: '#1A1F36' }}>Current Plan</h2>
                    <p className="text-sm mb-6" style={{ color: '#64748B' }}>You are currently on the Free plan.</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                      <div>
                        <h3 style={{ fontWeight: '600', color: '#1A1F36', margin: 0 }}>Free Tier</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, marginTop: '2px' }}>100 tasks / month</p>
                      </div>
                      <span style={{ padding: '4px 12px', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: '700', borderRadius: '9999px' }}>ACTIVE</span>
                    </div>

                    <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1F36' }}>Upgrade to Pro</h2>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', color: '#FFFFFF', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, marginBottom: '4px', color: '#FFFFFF' }}>Pro Plan</h3>
                          <p style={{ color: '#DBEAFE', fontSize: '0.875rem', margin: 0 }}>Unlock unlimited processing power</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>₹999</span>
                          <span style={{ color: '#DBEAFE', fontSize: '0.875rem' }}>/mo</span>
                        </div>
                      </div>
                      <ul style={{ fontSize: '0.875rem', color: '#EFF6FF', listStyle: 'none', padding: 0, margin: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#60A5FA' }}>✓</span> Unlimited AI Tasks
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#60A5FA' }}>✓</span> Priority Background Processing
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#60A5FA' }}>✓</span> Advanced Analytics
                        </li>
                      </ul>
                      <button 
                        onClick={handleUpgrade}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: '#FFFFFF', color: '#2563EB', fontWeight: '700', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <div className="card mb-6 shadow-sm" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                    <h2 className="text-lg font-bold mb-6 text-gray-900">Security Settings</h2>
                    
                    <form onSubmit={(e) => { e.preventDefault(); toast.success('Password updated'); }}>
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#1A1F36', fontSize: '0.875rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'} onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#1A1F36', fontSize: '0.875rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'} onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', outline: 'none', color: '#1A1F36', fontSize: '0.875rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)'} onBlur={(e) => e.target.style.boxShadow = 'none'} />
                        </div>
                      </div>
                      <div className="flex justify-end mb-8">
                        <button 
                          type="submit" 
                          style={{ padding: '0.6rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                        >
                          Update Password
                        </button>
                      </div>
                    </form>

                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1F36', margin: 0 }}>Two-Factor Authentication</h3>
                      <ToggleRow
                        label="Enable 2FA Protection"
                        description="Secure your account with a mobile authenticator app."
                        checked={false}
                        onChange={() => toast('2FA setup coming soon!', { icon: '🔐' })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <div className="card shadow-sm" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-900 m-0">Notification Preferences</h2>
                      <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>Choose what updates you want to receive.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <ToggleRow
                        label="Task Completion Alerts"
                        description="Get notified when a long-running background task finishes."
                        checked={true}
                        onChange={() => toast.success('Preference saved')}
                      />
                      <ToggleRow
                        label="Weekly Analytics Report"
                        description="Receive a summary of your workspace performance every Monday."
                        checked={false}
                        onChange={() => toast.success('Preference saved')}
                      />
                      <ToggleRow
                        label="New Login Alerts"
                        description="Get an email if your account is accessed from a new device."
                        checked={true}
                        onChange={() => toast.success('Preference saved')}
                      />
                      <ToggleRow
                        label="Product Updates"
                        description="Hear about new features and platform improvements."
                        checked={false}
                        onChange={() => toast.success('Preference saved')}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
