import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingCartBar from '../components/common/FloatingCartBar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingCartBar />
    </div>
  );
};

export default MainLayout;
