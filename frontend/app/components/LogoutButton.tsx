'use client';
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();

  // Handle user logout and redirect to login page
  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/login');
  };
  return (
    <button
      onClick={handleLogout}
      className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded w-full'
    >
      Logout
    </button>
  );
};
