
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';
import { GlobalProvider } from '@/app/providers/Provider';
import henceforthApi from '@/app/utils/henceforthApis';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import HolyLoader from "holy-loader";
import "./globals.css";
import { redirect } from 'next/navigation';
import favicon from "@/app/assets/images/favicon.ico";
import { ThemeProvider } from '@/components/theme-provider';

interface UserInfo {
  // Define the properties of UserInfo based on the expected structure
  id: string;
  name: string;
  email: string;
  access_token: string;
}

export const metadata: Metadata = {
  title: 'QIXS Admin',
  description: 'AI-powered call and chat services',
  icons: {
    icon: favicon.src,
  },
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
      userInfo = apiRes?.data;
      redirect('/dashboard');

    } catch (error) {
      console.error('Error fetching user info:', error);
      // redirect("/login")
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
          {/* <ThemeProvider
            attribute="class"
            // defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          > */}
            {children}
          {/* </ThemeProvider> */}
            <HolyLoader
              color="#7820cf"
              height="2px"
              speed={250}
              easing="linear"
              showSpinner={false} />

          </NuqsAdapter>
        </GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}