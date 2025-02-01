import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomeLayout from '@/components/layout/default-layout';
import { ClerkProvider } from '@clerk/nextjs';
function FantasyFusion({ Component, pageProps }: AppProps) {
  const router = useRouter();

  let Layout = HomeLayout;

  switch (true) {
    case router.pathname.startsWith('/dashboard'):
      Layout = DashboardLayout;
      break;
    default:
      Layout = HomeLayout;
  }

  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default FantasyFusion;
