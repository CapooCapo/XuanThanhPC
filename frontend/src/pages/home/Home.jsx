import React, { Suspense, lazy } from 'react';
import ChoiceModal from '@/components/ui/ChoiceModal/ChoiceModal';
import HeroSection from '@/components/common/sections/HeroSection/HeroSection';

const ShopIntroSection = lazy(() => import('@/components/common/sections/ShopIntroSection/ShopIntroSection'));
const FeaturedPCSection = lazy(() => import('@/components/common/sections/FeaturedPCSection/FeaturedPCSection'));
const BuildChoiceSection = lazy(() => import('@/components/common/sections/BuildChoiceSection/BuildChoiceSection'));
const ComponentGridSection = lazy(() => import('@/components/common/sections/ComponentGridSection/ComponentGridSection'));
const BenefitsSection = lazy(() => import('@/components/common/sections/BenefitsSection/BenefitsSection'));

const Home = () => {
  return (
    <div className="home-wrapper">
      <ChoiceModal />
      <main>
        <HeroSection />
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
          <ShopIntroSection />
          <FeaturedPCSection />
          <BuildChoiceSection />
          <ComponentGridSection />
          <BenefitsSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
