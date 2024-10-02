// src/components/Layouts/Layouts.tsx
import Footer from '@/Landings/Footer';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/Landings/Header';

const Layouts: React.FC = () => {

  return (
    <div>
      <Header/>
        <Outlet />
      <Footer />
    </div>
  );
};

export default Layouts;
