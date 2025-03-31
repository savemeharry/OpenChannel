import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import UserProfile from '../components/UserProfile';
import TelegramStar from '../components/TelegramStar';
import { MdOutlineLock, MdOutlineChat, MdFlashOn, MdOutlineDiamond } from 'react-icons/md';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 16px;
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 16px;
  letter-spacing: -0.03em;
`;

const SubLogo = styled.div`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
  letter-spacing: -0.01em;
`;

const Description = styled.div`
  margin-bottom: 40px;
  line-height: 1.6;
  position: relative;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23303030' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E") repeat;
    pointer-events: none;
    opacity: 0.5;
  }
  
  p {
    margin-bottom: 16px;
    font-size: 16px;
  }
  
  p:last-child {
    margin-bottom: 0;
  }
`;

const StarDescription = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  text-align: left;
`;

const StarText = styled.p`
  margin-left: 14px;
  margin-bottom: 0 !important;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 40px;
  text-align: left;
  
  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23303030' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E") repeat;
    pointer-events: none;
    opacity: 0.5;
  }
  
  &:hover {
    transform: translateY(-3px);
    border-color: var(--color-primary-light);
    box-shadow: var(--shadow-md);
  }
  
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  
  p {
    font-size: 14px;
    margin-bottom: 0;
    opacity: 0.9;
  }
`;

const FeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.color || 'rgba(91, 159, 255, 0.2)'};
  margin-right: 12px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
  max-width: 350px;
`;

const AccentCircle = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
  opacity: 0.15;
`;

const BlueCircle = styled(AccentCircle)`
  width: 250px;
  height: 250px;
  background-color: rgba(91, 159, 255, 0.15);
  top: 5%;
  left: 5%;
`;

const GreenCircle = styled(AccentCircle)`
  width: 300px;
  height: 300px;
  background-color: rgba(75, 214, 99, 0.1);
  bottom: 5%;
  right: 5%;
`;

const PinkCircle = styled(AccentCircle)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 91, 119, 0.1);
  bottom: 40%;
  left: 30%;
`;

// Создаем SVG иконки для использования вместо импорта из react-icons
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconChat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconFlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconDiamond = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="16 2 22 8.5 22 15.5 16 22 8 22 2 15.5 2 8.5 8 2 16 2"></polygon>
    <line x1="12" y1="22" x2="12" y2="2"></line>
    <path d="M22 8.5L12 2 2 8.5"></path>
    <path d="M2 15.5L12 22l10-6.5"></path>
  </svg>
);

const Home = () => {
  return (
    <Container>
      <BlueCircle />
      <GreenCircle />
      <PinkCircle />
      
      <Logo>OpenChannel</Logo>
      <SubLogo>Exclusive Content Access</SubLogo>
      
      <UserProfile />
      
      <Description>
        <StarDescription>
          <TelegramStar size={24} color="#5B9FFF" />
          <StarText>
            Our subscription service provides you with seamless access using Telegram Stars,
            making it easy to manage your membership.
          </StarText>
        </StarDescription>
      </Description>
      
      <FeatureList>
        <Feature>
          <h3>
            <FeatureIcon>
              <IconLock />
            </FeatureIcon>
            Premium Access
          </h3>
          <p>Exclusive content available only to subscribers</p>
        </Feature>
        <Feature>
          <h3>
            <FeatureIcon color="rgba(75, 214, 99, 0.2)">
              <IconChat />
            </FeatureIcon>
            Community
          </h3>
          <p>Connect with like-minded people</p>
        </Feature>
        <Feature>
          <h3>
            <FeatureIcon color="rgba(255, 91, 119, 0.2)">
              <IconFlash />
            </FeatureIcon>
            Updates
          </h3>
          <p>Get early access to new features</p>
        </Feature>
        <Feature>
          <h3>
            <FeatureIcon color="rgba(75, 214, 99, 0.2)">
              <IconDiamond />
            </FeatureIcon>
            Support
          </h3>
          <p>Priority support from our team</p>
        </Feature>
      </FeatureList>
      
      <Link to="/plans">
        <ActionButton fullWidth>View Subscription Plans</ActionButton>
      </Link>
      
      <Link to="/status">
        <ActionButton variant="outline" fullWidth style={{ marginTop: '16px' }}>
          Check Subscription Status
        </ActionButton>
      </Link>
    </Container>
  );
};

export default Home; 