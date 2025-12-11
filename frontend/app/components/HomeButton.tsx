'use client';
import { redirect } from 'next/navigation';

// Home button to redirect users to the homepage
export const HomeButton = () => {
  return (
    <button
      className='bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-4'
      onClick={() => redirect('/')}
    >
      Go Home
    </button>
  );
};
