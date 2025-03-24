import React from 'react';
import styled from 'styled-components';

// Responsive card component that adapts to different screen sizes
const Card = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

// Responsive button component with different sizes
const Button = styled.button`
  background-color: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? props.theme.colors.text : props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => {
    switch(props.size) {
      case 'sm': return '0.5rem 0.75rem';
      case 'lg': return '0.75rem 1.5rem';
      default: return '0.625rem 1.25rem';
    }
  }};
  font-size: ${props => {
    switch(props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryDark : 'rgba(30, 58, 138, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.fullWidthOnMobile ? '100%' : 'auto'};
  }
`;

// Responsive grid layout component
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: ${props => props.gap || '1.5rem'};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(${props => Math.min(props.columns || 3, 2)}, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(${props => Math.min(props.columns || 3, 2)}, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Responsive flex container
const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '1rem'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.mobileDirection || props.direction || 'row'};
    gap: ${props => props.mobileGap || props.gap || '1rem'};
  }
  
  @media (max-width: 480px) {
    flex-direction: ${props => props.smallMobileDirection || props.mobileDirection || props.direction || 'column'};
  }
`;

// Responsive text component
const Text = styled.p`
  font-size: ${props => {
    switch(props.size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      case '2xl': return '1.5rem';
      case '3xl': return '1.875rem';
      case '4xl': return '2.25rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => {
    switch(props.weight) {
      case 'light': return props.theme.fontWeights.light;
      case 'medium': return props.theme.fontWeights.medium;
      case 'semibold': return props.theme.fontWeights.semibold;
      case 'bold': return props.theme.fontWeights.bold;
      default: return props.theme.fontWeights.normal;
    }
  }};
  color: ${props => {
    switch(props.color) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'muted': return props.theme.colors.textSecondary;
      case 'danger': return props.theme.colors.danger;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.text;
    }
  }};
  text-align: ${props => props.align || 'left'};
  margin-bottom: ${props => props.mb || '0'};
  
  @media (max-width: 768px) {
    font-size: ${props => {
      switch(props.size) {
        case 'xs': return '0.75rem';
        case 'sm': return '0.875rem';
        case 'lg': return '1.125rem';
        case 'xl': return '1.25rem';
        case '2xl': return '1.375rem';
        case '3xl': return '1.5rem';
        case '4xl': return '1.75rem';
        default: return '1rem';
      }
    }};
  }
`;

// Responsive heading component
const Heading = styled.h1`
  font-size: ${props => {
    switch(props.as) {
      case 'h1': return '2.5rem';
      case 'h2': return '2rem';
      case 'h3': return '1.75rem';
      case 'h4': return '1.5rem';
      case 'h5': return '1.25rem';
      case 'h6': return '1.125rem';
      default: return '2.5rem';
    }
  }};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.mb || '1rem'};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: ${props => {
      switch(props.as) {
        case 'h1': return '2rem';
        case 'h2': return '1.75rem';
        case 'h3': return '1.5rem';
        case 'h4': return '1.25rem';
        case 'h5': return '1.125rem';
        case 'h6': return '1rem';
        default: return '2rem';
      }
    }};
  }
  
  @media (max-width: 480px) {
    font-size: ${props => {
      switch(props.as) {
        case 'h1': return '1.75rem';
        case 'h2': return '1.5rem';
        case 'h3': return '1.25rem';
        case 'h4': return '1.125rem';
        case 'h5': return '1rem';
        case 'h6': return '0.875rem';
        default: return '1.75rem';
      }
    }};
  }
`;

// Responsive container component
const Container = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

// Responsive form input component
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
`;

// Responsive form label component
const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

// Responsive form group component
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

// Responsive badge component
const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  background-color: ${props => {
    switch(props.variant) {
      case 'success': return props.theme.colors.success + '20';
      case 'danger': return props.theme.colors.danger + '20';
      case 'warning': return props.theme.colors.warning + '20';
      case 'info': return props.theme.colors.info + '20';
      default: return props.theme.colors.primary + '20';
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'success': return props.theme.colors.success;
      case 'danger': return props.theme.colors.danger;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.primary;
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'success': return props.theme.colors.success;
      case 'danger': return props.theme.colors.danger;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.primary;
    }
  }};
`;

export {
  Card,
  Button,
  Grid,
  Flex,
  Text,
  Heading,
  Container,
  Input,
  Label,
  FormGroup,
  Badge
};
