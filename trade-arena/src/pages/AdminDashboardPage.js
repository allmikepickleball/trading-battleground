import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../context/AdminContext';
import { getUsers, deleteUser, getDashboardStats } from '../services/adminService';

const AdminDashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? props.theme.fontWeights.bold : props.theme.fontWeights.medium};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const TableCell = styled.td`
  padding: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-right: 0.5rem;
  
  &:last-child {
    margin-right: 0;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: transparent;
  color: ${props => props.theme.colors.danger};
  border: 1px solid ${props => props.theme.colors.danger};
  
  &:hover {
    background-color: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.text};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  background-color: ${props => props.active ? props.theme.colors.success + '20' : props.theme.colors.danger + '20'};
  color: ${props => props.active ? props.theme.colors.success : props.theme.colors.danger};
  border: 1px solid ${props => props.active ? props.theme.colors.success : props.theme.colors.danger};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.danger};
`;

const AdminDashboardPage = () => {
  const { admin, isAuthenticated, loading: authLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);
  
  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load dashboard stats
      const statsData = await getDashboardStats();
      setStats(statsData);
      
      // Load users if on users tab
      if (activeTab === 'users') {
        const userData = await getUsers();
        setUsers(userData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.message || 'Failed to delete user');
        console.error('Failed to delete user:', err);
      }
    }
  };
  
  if (authLoading) {
    return <LoadingMessage>Loading admin panel...</LoadingMessage>;
  }
  
  if (!isAuthenticated) {
    return <ErrorMessage>You must be logged in as an admin to view this page.</ErrorMessage>;
  }
  
  return (
    <AdminDashboardContainer>
      <AdminHeader>
        <AdminTitle>
          Admin <span>Dashboard</span>
        </AdminTitle>
      </AdminHeader>
      
      {stats && (
        <StatsContainer>
          <StatCard>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.activeUsers}</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.newUsers}</StatValue>
            <StatLabel>New Users (7 days)</StatLabel>
          </StatCard>
        </StatsContainer>
      )}
      
      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </TabButton>
          <TabButton 
            active={activeTab === 'rankings'} 
            onClick={() => setActiveTab('rankings')}
          >
            Rankings
          </TabButton>
        </TabButtons>
        
        {loading ? (
          <LoadingMessage>Loading data...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : activeTab === 'users' ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Username</TableHeader>
                  <TableHeader>Display Name</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>
                      <StatusBadge active={user.isActive}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <EditButton>Edit</EditButton>
                      <DeleteButton onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Rank Tier</TableHeader>
                  <TableHeader>Performance</TableHeader>
                  <TableHeader>Win Rate</TableHeader>
                  <TableHeader>Consistency</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {stats && stats.topRankedUsers && stats.topRankedUsers.map(ranking => (
                  <TableRow key={ranking._id}>
                    <TableCell>{ranking.user.username}</TableCell>
                    <TableCell>{ranking.rankTier}</TableCell>
                    <TableCell>{ranking.performance.toFixed(2)}</TableCell>
                    <TableCell>{(ranking.winRate * 100).toFixed(1)}%</TableCell>
                    <TableCell>{ranking.consistencyScore.toFixed(1)}</TableCell>
                    <TableCell>
                      <EditButton>Adjust</EditButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </TabContainer>
    </AdminDashboardContainer>
  );
};

export default AdminDashboardPage;
