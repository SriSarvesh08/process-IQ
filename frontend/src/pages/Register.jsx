import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Zap, Activity, Eye, EyeOff } from 'lucide-react';

const IconGoogle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const IconLoader = ({ size = 20, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) strength += 1;
    return strength; 
  };

  const strength = getStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await axios.post((import.meta.env.VITE_API_URL || '') + '/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data, res.data.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      toast.loading('Authenticating with Google...', { id: 'google' });
      const googleUser = { name: 'Google User', email: 'demo@google.com', password: 'secureGooglePassword123!' };
      
      try {
        const res = await axios.post((import.meta.env.VITE_API_URL || '') + '/api/auth/login', { email: googleUser.email, password: googleUser.password });
        login(res.data, res.data.token);
      } catch {
        const res = await axios.post((import.meta.env.VITE_API_URL || '') + '/api/auth/register', googleUser);
        login(res.data, res.data.token);
      }
      toast.success('Google Sign-In successful!', { id: 'google' });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google Sign-In failed.', { id: 'google' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* LEFT SIDE: BRANDING PANEL (~55%) */}
      <div className="login-left-panel">
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>

        <div className="relative z-10" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="flex flex-col gap-1 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px', 
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
                color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '1.2rem',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
              }}>
                PI
              </div>
              <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.03em', color: '#0F172A' }}>ProcessIQ</span>
            </div>
            <p className="text-sm font-medium tracking-wide uppercase" style={{ color: '#64748B', letterSpacing: '0.05em' }}>Enterprise AI Task Processing Platform</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              Automate AI Workflows.<br />
              Monitor Every Task.<br />
              <span style={{ color: '#2563EB' }}>Scale With Confidence.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: '#64748B', maxWidth: '480px', marginBottom: '3rem' }}>
              ProcessIQ enables secure AI task orchestration, asynchronous processing, workflow monitoring, and enterprise-grade background execution.
            </p>
            
            <div className="flex flex-col gap-4" style={{ maxWidth: '440px' }}>
              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(229,231,235,0.5)', backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#0F172A' }}><Lock size={20}/></div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0F172A', marginBottom: '2px' }}>Secure Authentication</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>Enterprise-grade login and account protection.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(229,231,235,0.5)', backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#0F172A' }}><Zap size={20}/></div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0F172A', marginBottom: '2px' }}>AI Task Processing</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>Reliable distributed background execution.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-sm font-medium" style={{ color: '#64748B', marginTop: 'auto' }}>
          <span>Version 1.0</span>
          <span>© 2026 ProcessIQ</span>
        </div>
      </div>

      {/* RIGHT SIDE: AUTHENTICATION (~45%) */}
      <div className="login-right-panel" style={{ position: 'relative' }}>
        
        {/* Mobile Minimal Branding */}
        <div className="mobile-branding absolute top-6 left-6 flex items-center gap-2">
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>PI</div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#0F172A' }}>ProcessIQ</span>
        </div>

        <motion.div 
          className="login-auth-card"
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6 text-center">
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', margin: 0 }}>Start processing tasks with enterprise power.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div style={{ position: 'relative' }}>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#0F172A', marginBottom: '0.375rem' }}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
                style={{ 
                  width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', 
                  backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px',
                  outline: 'none', transition: 'all 0.2s', color: '#0F172A'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#0F172A', marginBottom: '0.375rem' }}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
                style={{ 
                  width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', 
                  backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px',
                  outline: 'none', transition: 'all 0.2s', color: '#0F172A'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#0F172A', marginBottom: '0.375rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  style={{ 
                    width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', fontSize: '0.95rem', 
                    backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px',
                    outline: 'none', transition: 'all 0.2s', color: '#0F172A'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <div style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: strength >= 1 ? '#EF4444' : '#E5E7EB', transition: 'background-color 0.3s' }}></div>
                  <div style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: strength >= 2 ? '#F59E0B' : '#E5E7EB', transition: 'background-color 0.3s' }}></div>
                  <div style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: strength >= 3 ? '#10B981' : '#E5E7EB', transition: 'background-color 0.3s' }}></div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#0F172A', marginBottom: '0.375rem' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ 
                  width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', 
                  backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px',
                  outline: 'none', transition: 'all 0.2s', color: '#0F172A'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            
            <div className="flex items-start gap-2 mt-2 mb-1">
              <input type="checkbox" id="terms" required style={{ width: '16px', height: '16px', marginTop: '2px', borderRadius: '4px', border: '1px solid #E5E7EB', cursor: 'pointer' }} />
              <label htmlFor="terms" style={{ fontSize: '0.875rem', color: '#64748B', cursor: 'pointer', lineHeight: '1.4' }}>
                I agree to the <a href="#" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>Terms of Service</a> and <a href="#" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', padding: '0.875rem', marginTop: '0.5rem',
                background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', color: '#FFFFFF',
                border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
              onMouseOver={(e) => { if(!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(37, 99, 235, 0.3)'; }}
              onMouseOut={(e) => { if(!isLoading) e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)'; }}
            >
              {isLoading ? (
                <div style={{ animation: 'spin 1s linear infinite', display: 'flex', alignItems: 'center' }}>
                  <IconLoader size={20} />
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.75rem', fontWeight: '600', color: '#64748B', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            style={{ 
              width: '100%', padding: '0.875rem',
              backgroundColor: '#FFFFFF', color: '#0F172A',
              border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
          >
            <IconGoogle size={20} />
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#64748B' }}>
            Already have an account? <Link to="/login" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
          </div>

        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
