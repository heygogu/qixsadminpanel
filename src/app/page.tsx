import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("COOKIES_ADMIN_ACCESS_TOKEN")?.value;
  // Redirecting server-side before the page renders
  if (!accessToken) {

    redirect('/login');
  } else {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}