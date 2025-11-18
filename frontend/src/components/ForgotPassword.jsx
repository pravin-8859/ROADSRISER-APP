import React, { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../api/mechanicApi';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const sendOtp = async () => {
    setLoading(true);
    try {
      await requestPasswordReset(phone);
      setMsg('OTP sent to your phone');
      setStep(2);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!otp || !newPass) return setMsg('Enter OTP and new password');
    setLoading(true);
    try {
      await resetPassword({ phone, otp, newPassword: newPass });
      setMsg('Password reset successful — please login');
      setStep(3);
      setTimeout(() => nav('/mechanic/login'), 1200);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Forgot Password</h3>
        {msg && <div className="text-sm text-gray-600 mb-3">{msg}</div>}

        {step === 1 && (
          <>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number (10 digits)" className="input mb-3" />
            <button onClick={sendOtp} disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
          </>
        )}

        {step === 2 && (
          <>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="input mb-3" />
            <input value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New password" type="password" className="input mb-3" />
            <button onClick={handleReset} disabled={loading} className="btn-primary w-full">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </>
        )}

        {step === 3 && <div className="text-green-600">Password reset — redirecting to login...</div>}
        <style>{`.input{width:100%;padding:10px;margin-bottom:8px;border-radius:8px;border:1px solid #e5e7eb}`}</style>
      </div>
    </div>
  );
}
