import { checkSession } from '@/lib/checkSession';

export default async function Dashboard() {
  // Check if user is authenticated
  await checkSession();

  return null;
}
