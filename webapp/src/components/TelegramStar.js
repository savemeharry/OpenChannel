import React from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  position: relative;
`;

const Shimmer = styled.div`
  position: absolute;
  top: -30%;
  left: -30%;
  width: 160%;
  height: 160%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  animation: shimmer 3s ease-in-out infinite;
  z-index: 0;
  border-radius: 50%;
  
  @keyframes shimmer {
    0% { transform: rotate(0deg); opacity: 0; }
    20% { opacity: 0.3; }
    40% { opacity: 0; }
    60% { opacity: 0.3; }
    80% { opacity: 0; }
    100% { transform: rotate(360deg); opacity: 0; }
  }
`;

const TelegramStar = ({ size = 24, color = '#5B9FFF' }) => {
  return (
    <StarContainer size={size}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path 
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
          fill={color} 
          stroke={color} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <Shimmer />
    </StarContainer>
  );
};

export default TelegramStar; 