import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import AppLayout from '@/components/AppLayout';
import { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // Await the dynamic cookies API
  const cookieStore = await cookies();

  // If parseUserFromRequest can accept raw cookie string:
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const mockReq = {
    headers: {
      cookie: cookieHeader,
    },
  };

  const user = parseUserFromRequest(mockReq as any);

  if (!user) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}

