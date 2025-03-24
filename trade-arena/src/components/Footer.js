import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const FooterLogo = styled.div`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const FooterLink = styled.a`
  color: ${props => props.theme.colors.textSecondary};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FooterCopyright = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          Trade <span>Arena</span>
        </FooterLogo>
        
        <FooterLinks>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinks>
        
        <FooterCopyright>
          &copy; {currentYear} Trade Arena. All rights reserved.
        </FooterCopyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
