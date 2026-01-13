import React from 'react';
import { motion } from 'framer-motion';
import FirstPage from '../LandingPage/FirstPage.tsx';
import Functionality from '../LandingPage/Functionality.tsx';
import Agents from '../LandingPage/Agents.tsx';
import PerplexityAppwriteSection from '../LandingPage/IBMGraniteAppwriteSection.tsx';
import SimpleHeader from '../components/layout/SimpleHeader';
import Footer from '../components/layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      <SimpleHeader />

      <motion.main
        className="flex-grow w-full max-w-[100vw] overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FirstPage />
        <Functionality />
        <Agents />
        <PerplexityAppwriteSection />
      </motion.main>

      <Footer />
    </div>
  );
};

export default LandingPage;