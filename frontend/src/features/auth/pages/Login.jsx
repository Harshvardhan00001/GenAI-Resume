import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center font-sans antialiased">
        <h1 className="text-xl font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-3 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans antialiased selection:bg-red-600 selection:text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-950 p-8 shadow-2xl shadow-red-950/20 border border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder-zinc-600 text-zinc-200 text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder-zinc-600 text-zinc-200 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-red-600 focus:ring-offset-black focus:ring-red-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-zinc-400">
                Remember me
              </label>
            </div>

            <div>
              <a href="#" className="font-medium text-red-500 hover:text-red-400 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-950/50 active:scale-[0.99] text-sm"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;