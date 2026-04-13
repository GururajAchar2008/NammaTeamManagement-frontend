import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role === 'TL' ? '/tl-dashboard' : '/member-dashboard');
    } else {
      setError(result.message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="NammaTeam Logo" className="mx-auto h-20 w-20 shadow-xl rounded-2xl mb-6" />
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">
            Sign in to manage your professional team
          </p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center"
            >
              {isLoggingIn ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-gray-500 font-medium">
              New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create first TL account</Link>
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center space-x-2 text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Secure Enterprise Login</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
