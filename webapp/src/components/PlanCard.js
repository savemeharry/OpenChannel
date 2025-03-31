import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import TelegramStar from './TelegramStar';

const Card = styled.div`
  background-color: var(--color-background-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: ${props => props.popular ? 'var(--color-success)' : 'var(--color-primary-light)'};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.popular 
      ? 'linear-gradient(90deg, var(--color-success), var(--color-success-dark))' 
      : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))'};
  }
  
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

const PopularBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(47, 201, 152, 0.15);
  color: var(--color-success);
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(47, 201, 152, 0.15);
  border: 1px solid rgba(47, 201, 152, 0.3);
`;

const PlanName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${props => props.popular ? 'var(--color-success)' : 'var(--color-primary)'};
`;

const PlanDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 20px 0;
  min-height: 48px;
`;

const PriceWrapper = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  position: relative;
  
  &:hover {
    border-color: ${props => props.popular ? 'rgba(47, 201, 152, 0.3)' : 'rgba(79, 116, 255, 0.3)'};
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-right: 8px;
  background: ${props => props.popular 
    ? 'linear-gradient(90deg, var(--color-success), var(--color-success-dark))' 
    : 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark))'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PriceUnit = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-secondary);
`;

const PlanPeriod = styled.div`
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 0 0 24px 0;
  padding: 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  margin-bottom: 14px;
  padding-left: 30px;
  position: relative;
  color: var(--color-text-secondary);
  
  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${props => props.popular ? 'var(--color-success)' : 'var(--color-primary)'};
    font-weight: 700;
    width: 20px;
    height: 20px;
    background: ${props => props.popular 
      ? 'rgba(47, 201, 152, 0.1)' 
      : 'rgba(79, 116, 255, 0.1)'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PlanCard = ({ plan, onSubscribe, isLoading }) => {
  // Determine if this is the quarterly (popular) plan
  const isPopular = plan.subscription_period_days === 90;
  
  return (
    <Card popular={isPopular}>
      {isPopular && <PopularBadge>Best Value</PopularBadge>}
      
      <PlanName popular={isPopular}>{plan.name}</PlanName>
      <PlanDescription>{plan.description || `Access to our closed group`}</PlanDescription>
      
      <PriceWrapper popular={isPopular}>
        <PriceRow>
          <PlanPrice popular={isPopular}>
            {plan.price_in_stars}
          </PlanPrice>
          <PriceUnit>
            <TelegramStar size={18} color={isPopular ? "#2FC998" : "#4F74FF"} />
            <span style={{ marginLeft: '4px' }}>Stars</span>
          </PriceUnit>
        </PriceRow>
        <PlanPeriod>{plan.subscription_period_days} days access</PlanPeriod>
      </PriceWrapper>
      
      <FeaturesList>
        <FeatureItem popular={isPopular}>Access to exclusive content</FeatureItem>
        <FeatureItem popular={isPopular}>Community discussions</FeatureItem>
        {plan.subscription_period_days >= 90 && (
          <FeatureItem popular={isPopular}>Priority support</FeatureItem>
        )}
        {plan.subscription_period_days >= 365 && (
          <FeatureItem popular={isPopular}>VIP-only events</FeatureItem>
        )}
      </FeaturesList>
      
      <Button 
        onClick={() => onSubscribe(plan.plan_id)} 
        fullWidth 
        disabled={isLoading}
        variant={isPopular ? 'success' : 'primary'}
      >
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </Button>
    </Card>
  );
};

export default PlanCard; 