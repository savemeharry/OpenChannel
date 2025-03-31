import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import TelegramStar from './TelegramStar';

const StatusCard = styled.div`
  background-color: var(--color-background-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 32px 24px;
  margin-bottom: 32px;
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
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234E5683' fill-opacity='0.07' fill-rule='evenodd'/%3E%3C/svg%3E") repeat;
    pointer-events: none;
    opacity: 0.6;
    z-index: 0;
  }
`;

const CardHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.active 
    ? 'linear-gradient(90deg, var(--color-success), var(--color-success-dark))' 
    : 'linear-gradient(90deg, var(--color-danger), rgba(245, 101, 101, 0.6))'};
  z-index: 1;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const StatusIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'rgba(47, 201, 152, 0.15)' 
    : 'rgba(245, 101, 101, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  border: 1px solid ${props => props.active 
    ? 'rgba(47, 201, 152, 0.3)' 
    : 'rgba(245, 101, 101, 0.3)'};
  
  &:before {
    content: ${props => props.active ? '"✓"' : '"×"'};
    color: ${props => props.active ? 'var(--color-success)' : 'var(--color-danger)'};
    font-size: 24px;
    font-weight: 700;
  }
`;

const StatusTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  color: ${props => props.active ? 'var(--color-success)' : 'var(--color-danger)'};
`;

const StatusDetails = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
  position: relative;
  z-index: 1;
  
  &:hover {
    border-color: ${props => props.active ? 'rgba(47, 201, 152, 0.3)' : 'rgba(79, 116, 255, 0.3)'};
  }
`;

const StatusDetail = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
  
  ${props => props.highlight && `
    color: var(--color-success);
  `}
  
  ${props => props.warning && `
    color: var(--color-warning);
  `}
  
  ${props => props.danger && `
    color: var(--color-danger);
  `}
`;

const StatusMessage = styled.div`
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  position: relative;
  z-index: 1;
  padding: 0 8px;
`;

const StarsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const SubscriptionStatus = ({ status, onRenew }) => {
  if (!status) {
    return (
      <StatusCard>
        <div className="loading-spinner"></div>
      </StatusCard>
    );
  }

  return (
    <StatusCard active={status.has_active_subscription}>
      <CardHighlight active={status.has_active_subscription} />
      <StatusHeader>
        <StatusIcon active={status.has_active_subscription} />
        <StatusTitle active={status.has_active_subscription}>
          {status.has_active_subscription ? 'Active Subscription' : 'No Active Subscription'}
        </StatusTitle>
      </StatusHeader>
      
      {status.has_active_subscription ? (
        <>
          <StatusDetails active={true}>
            <StatusDetail>
              <DetailLabel>
                <TelegramStar size={16} color="#4F74FF" style={{ marginRight: '8px' }} />
                Plan:
              </DetailLabel>
              <DetailValue>{status.plan_name}</DetailValue>
            </StatusDetail>
            <StatusDetail>
              <DetailLabel>Expires on:</DetailLabel>
              <DetailValue>{formatDate(status.expiration_date)}</DetailValue>
            </StatusDetail>
            <StatusDetail>
              <DetailLabel>Time left:</DetailLabel>
              <DetailValue 
                highlight={status.time_left_days > 14} 
                warning={status.time_left_days <= 14 && status.time_left_days > 7}
                danger={status.time_left_days <= 7}
              >
                {status.time_left_days} days
              </DetailValue>
            </StatusDetail>
          </StatusDetails>
          
          {status.time_left_days < 7 && (
            <StatusMessage>
              Your subscription will expire soon. Consider renewing to maintain uninterrupted access.
            </StatusMessage>
          )}
          
          {status.time_left_days < 7 && (
            <Button 
              onClick={onRenew} 
              fullWidth
              variant={status.time_left_days < 3 ? 'primary' : 'outline'}
            >
              Renew Subscription
            </Button>
          )}
        </>
      ) : (
        <>
          <StarsRow>
            {[...Array(5)].map((_, i) => (
              <TelegramStar
                key={i}
                size={i === 2 ? 32 : 24}
                color={i === 2 ? "#4F74FF" : "rgba(79, 116, 255, 0.5)"}
                style={{ margin: '0 4px' }}
              />
            ))}
          </StarsRow>
        
          <StatusMessage>
            You don't have an active subscription. Purchase a subscription to access our exclusive content and community.
          </StatusMessage>
          
          <Button onClick={onRenew} fullWidth>
            View Subscription Plans
          </Button>
        </>
      )}
    </StatusCard>
  );
};

export default SubscriptionStatus; 