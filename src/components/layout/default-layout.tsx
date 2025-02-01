import Header from '@/components/header';
import Footer from '@/components/footer';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
     <h1>Home page</h1>
      <Header />
      <div className="dashboard-content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
