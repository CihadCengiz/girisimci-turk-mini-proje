import { checkSession } from '@/lib/checkSession';

export default async function Home() {
  // Check if user is authenticated
  await checkSession();

  return null;
}
