import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const LoginTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 1.5rem;
  text-align: center;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textSecondary};
`;

const Input = styled.input`
  padding: 0.75rem;
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
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-top: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: #000;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  
  a {
    color: ${props => props.theme.colors.secondary};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin-left: 0.25rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { username, password } = formData;
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await loginUser({ username, password });
      // Redirect will happen automatically due to the useEffect
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>
          Login to <span>Trade Arena</span>
        </LoginTitle>
        
        <LoginForm onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </LoginForm>
        
        <RegisterLink>
          Don't have an account?
          <Link to="/register">Register</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
