import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import PlanCard from '../components/PlanCard';
import Button from '../components/Button';
import { getSubscriptionPlans, createInvoice } from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  text-align: center;
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
  margin-bottom: 24px;
  max-width: 450px;
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

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  padding: 16px;
  border-radius: var(--border-radius);
  margin-bottom: 24px;
  text-align: center;
  border: 1px solid rgba(255, 59, 48, 0.2);
`;

const PlansSection = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 20px;
    left: -30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(75, 107, 255, 0.1);
    filter: blur(30px);
    z-index: -1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 40px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(34, 232, 124, 0.1);
    filter: blur(40px);
    z-index: -1;
  }
`;

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  
  // Initialize with user data from Telegram WebApp
  const initData = WebApp.initData || '';
  const userId = WebApp.initDataUnsafe?.user?.id;
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getSubscriptionPlans();
        setPlans(plansData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);
  
  const handleSubscribe = async (planId) => {
    if (!userId) {
      setError('Could not identify user. Please restart the mini app.');
      return;
    }
    
    setProcessingPlanId(planId);
    
    try {
      const response = await createInvoice(planId, userId);
      const { invoice_link } = response;
      
      if (invoice_link) {
        WebApp.openInvoice(invoice_link, function(status) {
          if (status === 'paid') {
            // Redirect to status page after successful payment
            window.location.href = '/status';
          } else {
            setProcessingPlanId(null);
          }
        });
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice. Please try again later.');
      setProcessingPlanId(null);
    }
  };
  
  return (
    <Container>
      <BackButtonWrapper>
        <Link to="/">
          <BackButton variant="outline">Back to Home</BackButton>
        </Link>
      </BackButtonWrapper>
      
      <Header>
        <HeaderTitle>Subscription Plans</HeaderTitle>
        <HeaderSubtitle>
          Choose the plan that works best for you and get exclusive access to our community.
        </HeaderSubtitle>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <Loading>
          <div className="loading-spinner"></div>
          <LoadingText>Loading subscription plans...</LoadingText>
        </Loading>
      ) : (
        <PlansSection>
          {plans.length === 0 ? (
            <p>No subscription plans available at the moment.</p>
          ) : (
            plans.map((plan) => (
              <PlanCard
                key={plan.plan_id}
                plan={plan}
                onSubscribe={handleSubscribe}
                isLoading={processingPlanId === plan.plan_id}
              />
            ))
          )}
        </PlansSection>
      )}
    </Container>
  );
};

export default Plans; 