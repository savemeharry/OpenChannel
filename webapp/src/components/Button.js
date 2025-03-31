import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 12px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Button variants */
  background-color: ${props => {
    if (props.variant === 'outline') return 'transparent';
    if (props.variant === 'success') return 'var(--color-success)';
    return 'var(--color-primary)'; // default primary
  }};
  
  color: ${props => {
    if (props.variant === 'outline') return 'var(--color-primary)';
    return 'var(--color-white)';
  }};
  
  border: ${props => props.variant === 'outline' ? '2px solid var(--color-primary)' : 'none'};
  
  box-shadow: ${props => {
    if (props.variant === 'outline') return 'none';
    if (props.variant === 'success') return 'var(--shadow-glow-green)';
    return 'var(--shadow-glow-blue)';
  }};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'outline') return 'rgba(75, 107, 255, 0.1)';
      if (props.variant === 'success') return 'rgba(34, 232, 124, 0.9)';
      return 'rgba(75, 107, 255, 0.9)';
    }};
    transform: translateY(-3px);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:before {
      display: none;
    }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled, 
  fullWidth,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 