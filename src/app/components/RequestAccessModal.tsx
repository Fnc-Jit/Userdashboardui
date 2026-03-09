import { useState } from 'react';
import { X, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function RequestAccessModal({ isOpen, onClose, title = 'Request Access' }: RequestAccessModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[\d\s\-\+\(\)]{7,}$/.test(formData.phone)) errs.phone = 'Enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
      setSubmitted(false);
      setLoading(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Gradient top bar */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF6B35, #E8478C, #3B82F6)' }} />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
              style={{ color: '#8B8FA3' }}
            >
              <X size={18} />
            </button>

            <div className="p-8">
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)' }}
                    >
                      <Shield size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: '#FFFFFF' }}>{title}</h2>
                      <p className="text-xs" style={{ color: '#8B8FA3' }}>Fill in your details to get started</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B8FA3' }}>
                        Full Name <span style={{ color: '#FF4C4C' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: errors.name ? '1px solid #FF4C4C' : '1px solid rgba(255,255,255,0.1)',
                          color: '#FFFFFF',
                          focusRing: '#FF6B35',
                        }}
                      />
                      {errors.name && <p className="text-xs mt-1" style={{ color: '#FF4C4C' }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B8FA3' }}>
                        Work Email <span style={{ color: '#FF4C4C' }}>*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: errors.email ? '1px solid #FF4C4C' : '1px solid rgba(255,255,255,0.1)',
                          color: '#FFFFFF',
                        }}
                      />
                      {errors.email && <p className="text-xs mt-1" style={{ color: '#FF4C4C' }}>{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B8FA3' }}>
                        Phone Number <span style={{ color: '#FF4C4C' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: errors.phone ? '1px solid #FF4C4C' : '1px solid rgba(255,255,255,0.1)',
                          color: '#FFFFFF',
                        }}
                      />
                      {errors.phone && <p className="text-xs mt-1" style={{ color: '#FF4C4C' }}>{errors.phone}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-6"
                      style={{ background: 'linear-gradient(135deg, #FF6B35, #E8478C)', color: '#FFFFFF' }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>

                    <p className="text-[11px] text-center mt-3" style={{ color: '#8B8FA3' }}>
                      By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </>
              ) : (
                /* Success state */
                <motion.div
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(75,222,128,0.1)', border: '2px solid rgba(75,222,128,0.3)' }}
                  >
                    <CheckCircle size={32} style={{ color: '#4BDE80' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Request Submitted!</h3>
                  <p className="text-sm mb-6" style={{ color: '#8B8FA3' }}>
                    Thank you, <span style={{ color: '#FFFFFF' }}>{formData.name}</span>. Our team will review your request and reach out to <span style={{ color: '#FF6B35' }}>{formData.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }}
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
