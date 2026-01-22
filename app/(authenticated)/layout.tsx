import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import AppLayout from '@/components/AppLayout';
import { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

// This is a Server Component layout
export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // Get cookies from the request
  const cookieStore = cookies();

  // Create a mock request object for your auth parser
  const mockReq = {
    headers: {
      cookie: cookieStore.toString(),
    },
  };

  const user = parseUserFromRequest(mockReq as any);

  if (!user) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}
