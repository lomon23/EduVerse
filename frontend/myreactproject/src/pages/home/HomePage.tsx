import React from 'react';
import { Box, Divider } from '@mui/material';
import HomeHeader from './components/Header_home';
import HeroSection from './components/Hero_Section';
import Advantages from './components/advantages';
import HowToWork from './components/haw_to_work';
import Reviews from './components/reviews';
import Payment from './components/paymant';
import ContactUs from './components/contact_us';
import Footer from './components/footer';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <HomeHeader />
      <HeroSection />
      <Divider sx={{ 
        borderColor: 'rgb(255, 255, 255)',
        width: '800px',
        mx: 'auto'
      }} />
      <Advantages />
      <Divider sx={{ 
        borderColor: 'rgb(255, 255, 255)',
        width: '800px',
        mx: 'auto'
      }} />
      <HowToWork />
      <Divider sx={{ 
        borderColor: 'rgb(255, 255, 255)',
        width: '800px',
        mx: 'auto'
      }} />
      <Reviews />
      <Divider sx={{ 
        borderColor: 'rgb(255, 255, 255)',
        width: '800px',
        mx: 'auto'
      }} />
      <Payment />
      <Divider sx={{ 
        borderColor: 'rgb(255, 255, 255)',
        width: '800px',
        mx: 'auto'
      }} />
      <ContactUs />
      <Footer />
    </Box>
  );
};

export default HomePage;
