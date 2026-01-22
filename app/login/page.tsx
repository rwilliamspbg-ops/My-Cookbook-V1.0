import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import LoginForm from './LoginForm';

interface MockRequest {
  headers: {
    cookie?: string;
  };
}

export default async function LoginPage() {
  // Check if already logged in
  const cookieStore = await cookies();

  const mockReq: MockRequest = {
    headers: { cookie: cookieStore.toString() },
  };

  const user = parseUserFromRequest(mockReq);

  if (user) {
    redirect('/');
  }

  return <LoginForm />;
}

