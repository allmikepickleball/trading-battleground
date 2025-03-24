import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: ${props => props.theme.colors.backgroundAlt};
    padding: 1rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    margin-left: 0;
    width: 100%;
    text-align: center;
    padding: 0.5rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const LoginButton = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    margin-left: 0;
    width: 100%;
    text-align: center;
    padding: 0.5rem;
  }
`;

const RegisterButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-left: 1rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.danger};
  border: 1px solid ${props => props.theme.colors.danger};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-left: 1rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.text};
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    margin-left: 0;
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          Trade <span>Arena</span>
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <Nav isOpen={menuOpen}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</NavLink>
          <NavLink to="/message-board" onClick={() => setMenuOpen(false)}>Message Board</NavLink>
          <NavLink to="/market-data" onClick={() => setMenuOpen(false)}>Market Data</NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/trade-log" onClick={() => setMenuOpen(false)}>Trade Log</NavLink>
              <NavLink to="/journal" onClick={() => setMenuOpen(false)}>Journal</NavLink>
              <AuthButtons>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </AuthButtons>
            </>
          ) : (
            <AuthButtons>
              <LoginButton to="/login" onClick={() => setMenuOpen(false)}>Login</LoginButton>
              <RegisterButton to="/register" onClick={() => setMenuOpen(false)}>Register</RegisterButton>
            </AuthButtons>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
