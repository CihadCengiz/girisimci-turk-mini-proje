'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle login form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Send login request to the server
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center flex-col'>
      <div className='flex flex-row gap-10 p-5'>
        <div>
          <h1 className="font-bold">User</h1>
          <p><b>Email:</b> test@test.com</p>
          <p><b>Password:</b> 12345678</p>
        </div>
        <div>
          <h1 className="font-bold">JS Instructor</h1>
          <p><b>Email:</b> js1@js.com</p>
          <p><b>Password:</b> 12345678</p>
        </div>
        <div>
          <h1 className="font-bold">Marketing Instructor</h1>
          <p><b>Email:</b> marketing1@marketing.com</p>
          <p><b>Password:</b> 12345678</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className='border rounded-md p-6 w-full max-w-sm space-y-4'
      >
        <h1 className='text-xl font-bold'>Login</h1>
        {error && <div className='text-sm text-red-600'>{error}</div>}
        <div className='space-y-1'>
          <label className='block text-sm font-medium'>Email</label>
          <input
            type='email'
            className='border rounded px-2 py-1 w-full text-sm'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='space-y-1'>
          <label className='block text-sm font-medium'>Password</label>
          <input
            type='password'
            className='border rounded px-2 py-1 w-full text-sm'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full border rounded py-2 text-sm font-medium'
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <p className='text-xs text-gray-500'>
          Do not have an account?{' '}
          <a href='/signup' className='underline'>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
