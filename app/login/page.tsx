import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  // Check if already logged in
  const cookieStore = await cookies();
  const mockReq = {
    headers: { cookie: cookieStore.toString() },
  };
  const user = parseUserFromRequest(mockReq as any);

  if (user) {
    redirect('/');
  }

  return <LoginForm />;
}
