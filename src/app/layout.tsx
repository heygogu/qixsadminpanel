
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';
import { GlobalProvider } from '@/app/providers/Provider';
import henceforthApi from '@/app/utils/henceforthApis';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";

interface UserInfo {
  // Define the properties of UserInfo based on the expected structure
  id: string;
  name: string;
  email: string;
  access_token: string;
}

export const metadata: Metadata = {
  title: 'QIXS',
  description: 'AI-powered call and chat services'
};

const rubik = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("COOKIES_ADMIN_ACCESS_TOKEN")?.value;

  let userInfo: UserInfo | undefined = undefined;
  if (accessToken) {
    try {
      henceforthApi.setToken(accessToken);
      const apiRes = await henceforthApi.SuperAdmin.profile();
      userInfo = { ...apiRes.data, access_token: accessToken };
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Consider redirecting to login or handling the error appropriately
    }
  }

  // const session = await auth();

  return (
    <html
      lang="en"
      className={rubik.className}
      suppressHydrationWarning
    >
      <body className="overflow-hidden">

        <GlobalProvider userInfo={userInfo}>
          <NuqsAdapter>

            {children}

          </NuqsAdapter>
        </GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}