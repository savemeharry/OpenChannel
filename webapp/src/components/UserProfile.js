import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WebApp from '@twa-dev/sdk';
import { getSubscriptionStatus } from '../services/api';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--color-background-card);
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
    background: linear-gradient(45deg, transparent 65%, rgba(255, 255, 255, 0.03) 100%);
    pointer-events: none;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 16px;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const DefaultAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-white);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const StatusIndicator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--color-success)' : 'var(--color-danger)'};
  border: 2px solid var(--color-background-card);
  box-shadow: 0 0 0 2px ${props => props.active ? 'rgba(54, 210, 148, 0.25)' : 'rgba(255, 82, 82, 0.25)'};
`;

const UserInfo = styled.div`
  flex: 1;
  text-align: left;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--color-text-primary);
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.active ? 'var(--color-success)' : 'var(--color-danger)'};
  font-weight: 500;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 16px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 16px;
  min-width: 80px;
  border-radius: var(--border-radius-full);
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.active 
    ? 'rgba(54, 210, 148, 0.15)' 
    : 'rgba(255, 82, 82, 0.15)'};
  color: ${props => props.active ? 'var(--color-success)' : 'var(--color-danger)'};
`;

const UserProfile = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get user data from Telegram WebApp
  const user = WebApp.initDataUnsafe?.user || {};
  const userId = user.id;
  const userName = user.first_name || 'User';
  const avatarUrl = user.photo_url;
  
  // Get the first letter of the name for default avatar
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'U';
  
  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const statusData = await getSubscriptionStatus(userId);
        setStatus(statusData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching subscription status:', err);
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, [userId]);
  
  const isActive = status?.has_active_subscription || false;
  
  return (
    <ProfileContainer>
      <AvatarContainer>
        {avatarUrl ? (
          <Avatar src={avatarUrl} alt={userName} />
        ) : (
          <DefaultAvatar>{firstLetter}</DefaultAvatar>
        )}
        {!loading && <StatusIndicator active={isActive} />}
      </AvatarContainer>
      
      <UserInfo>
        <UserName>{userName}</UserName>
        <UserStatus active={isActive}>
          {isActive ? 'Active subscription' : 'No active subscription'}
        </UserStatus>
      </UserInfo>
      
      <RightContent>
        {!loading && (
          <Badge active={isActive}>
            {isActive ? `${status.time_left_days} days left` : 'Inactive'}
          </Badge>
        )}
      </RightContent>
    </ProfileContainer>
  );
};

export default UserProfile; 