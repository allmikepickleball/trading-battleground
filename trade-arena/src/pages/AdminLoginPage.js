import React, { useState } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 0.5rem;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
`;

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>
            Admin <span>Login</span>
          </LoginTitle>
          <LoginSubtitle>
            Enter your credentials to access the admin panel
          </LoginSubtitle>
        </LoginHeader>
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </SubmitButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginCard>
    </AdminLoginContainer>
  );
};

export default AdminLoginPage;
