import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import PageTemplate from "@/components/templates/PageTemplate";
import CarouselWithContent from "@/components/organisms/CarouselWithContent";
import ProdukContainer from "@/components/organisms/ProdukContainer";
import BeritaSection from "@/components/organisms/BeritaSection";
import AboutUs from "@/components/organisms/AboutUs";
import InstitutionsSection from "@/components/organisms/InstitutionsSection";
import Iso from "@/components/organisms/Market";
import Pengumuman from "@/components/organisms/Pengumuman";
import LiveQuotesCta from "@/components/organisms/LiveQuotesCta";


export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'navbar',
        'about-us',
        'produk',
        'berita',
        'market',
        'pengumuman',
        'trading',
        'footer'
      ])),
    },
  };
};

// Import WelcomeModal dengan dynamic import dan non-SSR
const WelcomeModal = dynamic(
  () => import('@/components/moleculs/WelcomeModal'),
  { ssr: false }
);

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Open modal automatically on page load
    setShowModal(true);
  }, []);

  const handleCloseModal = () => setShowModal(false);

  return (
    <PageTemplate>
      <WelcomeModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
      />

      {/* Carousel */}
      <CarouselWithContent />

      {/* Content */}
      <div className="py-10 bg-white space-y-10">
        <div className="space-y-10 mb-20">
          
          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <AboutUs />
          </div>

          <hr className="border-gray-200" />

          <Iso />

          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <LiveQuotesCta />
          </div>

          <hr className="border-gray-200" />

          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <ProdukContainer />
          </div>

          <hr className="border-gray-200" />

          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <BeritaSection/>
          </div>

          <hr className="border-gray-200" />

          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52 my-20">
            <Pengumuman showHeader={true} className="mx-auto px-4" />
          </div>

          <hr className="border-gray-200" />

          <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <InstitutionsSection />
          </div>

        </div>
      </div>
    </PageTemplate>
  );
};


export default HomePage;
