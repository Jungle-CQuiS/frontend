import styled, { keyframes } from "styled-components";


const backgroundMove = keyframes`
  0% {
    background-position: center top;
  }
  50% {
    background-position: center 20px; /* 원하는 만큼 이동 */
  }
  100% {
    background-position: center top;
  }
`;

const waveEffect = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.2); 
  }
`;

interface WaveLetterProps {
    delay: string;
  }

  export const WaveLetter = styled.span<WaveLetterProps>`
  display: inline-block;
  animation: ${waveEffect} 2s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
  margin-right: 10px;
`;

export const LandingPageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 150px;
  background-image: url('/images/landing.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  animation: ${backgroundMove} 3s ease-in-out infinite;
`;

export const LandingPageWrap = styled.div`
  padding: 0px 150px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  margin-top: 50px;
`;

export const LandingPageTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LandingPageTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  `;

export const LandingPageText = styled.img`
  width: 653px;
`;

export const LandingPageTextPrimary = styled.div`
  font-size: 60px;
  font-weight: 800;
  color: #2F69FF;
  display: flex;
`;

export const LandingPageTextSecondary = styled.div`
  font-size: 60px;
  font-weight: 800;
  color: #EE5567;
`;
