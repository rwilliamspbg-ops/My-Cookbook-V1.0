import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import AppLayout from '@/components/AppLayout';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get cookies from the request
  const cookieStore = await cookies();
  
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
