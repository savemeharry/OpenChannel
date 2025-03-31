import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import SubscriptionStatus from '../components/SubscriptionStatus';
import Button from '../components/Button';
import UserProfile from '../components/UserProfile';
import TelegramStar from '../components/TelegramStar';
import { getSubscriptionStatus } from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 16px;
`;

const BackButton = styled(Button)`
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '←';
    margin-right: 8px;
    font-size: 18px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
`;

const HeaderSubtitle = styled.p`
  color: var(--color-text-secondary);
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  margin: 40px 0;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  background-color: rgba(245, 101, 101, 0.1);
  color: var(--color-danger);
  padding: 18px;
  border-radius: var(--border-radius);
  margin-bottom: 24px;
  text-align: center;
  border: 1px solid rgba(245, 101, 101, 0.2);
  position: relative;
  
  &:before {
    content: '!';
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: rgba(245, 101, 101, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  }
`;

const InfoCard = styled.div`
  background-color: var(--color-background-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234E5683' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E") repeat;
    pointer-events: none;
    opacity: 0.6;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  margin-bottom: 0;
  margin-left: 12px;
  position: relative;
  z-index: 1;
`;

const StatusSection = styled.div`
  position: relative;
`;

const Status = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Initialize with user data from Telegram WebApp
  const userId = WebApp.initDataUnsafe?.user?.id;
  
  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) {
        setError('Could not identify user. Please restart the mini app.');
        setLoading(false);
        return;
      }
      
      try {
        const statusData = await getSubscriptionStatus(userId);
        setStatus(statusData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching subscription status:', err);
        setError('Failed to load subscription status. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, [userId]);
  
  const handleRenew = () => {
    navigate('/plans');
  };
  
  return (
    <Container>
      <BackButtonWrapper>
        <Link to="/">
          <BackButton variant="outline">Back to Home</BackButton>
        </Link>
      </BackButtonWrapper>
      
      <Header>
        <HeaderTitle>My Subscription</HeaderTitle>
        <HeaderSubtitle>View and manage your subscription status</HeaderSubtitle>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <Loading>
          <div className="loading-spinner"></div>
          <LoadingText>Loading subscription status...</LoadingText>
        </Loading>
      ) : (
        <StatusSection>
          <UserProfile />
          
          <SubscriptionStatus status={status} onRenew={handleRenew} />
          
          {status?.has_active_subscription && (
            <InfoCard>
              <InfoRow>
                <TelegramStar size={24} color="#4F74FF" />
                <InfoText>You can access the group using the invite link provided by the bot.</InfoText>
              </InfoRow>
            </InfoCard>
          )}
          
          {!status?.has_active_subscription && (
            <Link to="/plans">
              <Button fullWidth>Explore Subscription Plans</Button>
            </Link>
          )}
        </StatusSection>
      )}
    </Container>
  );
};

export default Status; 