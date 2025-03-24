import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeroSection = styled.section`
  background: linear-gradient(rgba(10, 14, 23, 0.8), rgba(10, 14, 23, 0.9)), 
              url('/src/assets/images/trading-bg.jpg') no-repeat center center;
  background-size: cover;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${props => props.theme.colors.text};
  padding: 0 2rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 1.5rem;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: #000;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  border: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  text-align: center;
  margin-bottom: 3rem;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  transition: ${props => props.theme.transitions.default};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const RankingSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${props => props.theme.colors.backgroundAlt};
`;

const RankingTiers = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const TierCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const TierIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const TierName = styled.h3`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 0.5rem;
`;

const TierRequirement = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const CTASection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(rgba(10, 14, 23, 0.9), rgba(10, 14, 23, 0.95)), 
              url('/src/assets/images/cta-bg.jpg') no-repeat center center;
  background-size: cover;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 1.5rem;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Welcome to <span>Trade Arena</span>
          </HeroTitle>
          <HeroSubtitle>
            A high-performance, competitive trading platform built for traders who take their craft seriously.
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/register">Get Started</PrimaryButton>
            <SecondaryButton to="/leaderboard">View Leaderboard</SecondaryButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>
          Platform <span>Features</span>
        </SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Trade Tracking</FeatureTitle>
            <FeatureDescription>
              Log and track your trades with detailed metrics including entry/exit prices, stop loss, take profit, and more.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🏆</FeatureIcon>
            <FeatureTitle>Competitive Rankings</FeatureTitle>
            <FeatureDescription>
              Compete with other traders on our permanent leaderboard based on profitability and consistency.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Message Board</FeatureTitle>
            <FeatureDescription>
              Connect with other traders through our open message board to share insights and strategies.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>Trading Journal</FeatureTitle>
            <FeatureDescription>
              Keep a detailed trading journal with calendar view to track your daily progress and reflections.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle>Data Visualization</FeatureTitle>
            <FeatureDescription>
              View your trading performance through high-quality charts and visualizations.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Access the platform on any device with our fully responsive design.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <RankingSection>
        <SectionTitle>
          Ranking <span>Tiers</span>
        </SectionTitle>
        <RankingTiers>
          <TierCard>
            <TierIcon>👑</TierIcon>
            <TierName>Monarch Trader</TierName>
            <TierRequirement>+50% or more weekly performance</TierRequirement>
          </TierCard>
          
          <TierCard>
            <TierIcon>💰</TierIcon>
            <TierName>Capitalist</TierName>
            <TierRequirement>+30% to +49.99% weekly performance</TierRequirement>
          </TierCard>
          
          <TierCard>
            <TierIcon>💎</TierIcon>
            <TierName>Diamond Hands</TierName>
            <TierRequirement>+20% to +29.99% weekly performance</TierRequirement>
          </TierCard>
          
          <TierCard>
            <TierIcon>📈</TierIcon>
            <TierName>Profitable Platinum</TierName>
            <TierRequirement>+10% to +19.99% weekly performance</TierRequirement>
          </TierCard>
        </RankingTiers>
      </RankingSection>
      
      <CTASection>
        <CTAContent>
          <CTATitle>
            Ready to <span>Compete</span>?
          </CTATitle>
          <CTADescription>
            Join Trade Arena today and prove your trading skills against the best.
          </CTADescription>
          <PrimaryButton to="/register">Create Account</PrimaryButton>
        </CTAContent>
      </CTASection>
    </>
  );
};

export default HomePage;
