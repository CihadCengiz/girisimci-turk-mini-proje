import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const checkSession = async () => {
    const session = await getSession();

    // Redirect based on session status and role
    if (!session) {
        redirect('/login');
    }

    if (session.role === 'user') {
        redirect('/dashboard/user');
    }

    if (session.role === 'instructor') {
        redirect('/dashboard/instructor');
    }

    if (session.role === 'admin') {
        redirect('/dashboard/admin');
    }

    return null;
};