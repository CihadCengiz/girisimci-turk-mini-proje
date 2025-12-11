'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle signup form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Send signup request to the server
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard/user');
    } catch (err) {
      console.log('err=>', err);
      setError('Unexpected error');
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='border rounded-md p-6 w-full max-w-sm space-y-4'
      >
        <h1 className='text-xl font-bold'>Sign Up</h1>
        {error && <div className='text-sm text-red-600'>{error}</div>}
        <div className='space-y-1'>
          <label className='block text-sm font-medium'>Email</label>
          <input
            type="email"
            className='border rounded px-2 py-1 w-full text-sm'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='space-y-1'>
          <label className='block text-sm font-medium'>Username</label>
          <input
            className='border rounded px-2 py-1 w-full text-sm'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className='text-xs text-gray-500'>
          Already have an account?{' '}
          <a href='/login' className='underline'>
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
