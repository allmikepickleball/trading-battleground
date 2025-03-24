import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const DashboardActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: #000;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const CardAction = styled(Link)`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.secondary};
  
  &:hover {
    text-decoration: underline;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.color || props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const RecentTradesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
`;

const ProfitLossValue = styled.span`
  color: ${props => props.isProfit ? props.theme.colors.success : props.theme.colors.danger};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const RankCard = styled(DashboardCard)`
  grid-column: span 3;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-column: span 2;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-column: span 1;
  }
`;

const RankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RankBadge = styled.div`
  background-color: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const RankDetails = styled.div`
  flex: 1;
`;

const RankTitle = styled.div`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 0.5rem;
`;

const RankDescription = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.full};
  margin-top: 1rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const DashboardPage = () => {
  // This would be replaced with actual user data
  const userData = {
    name: 'John Trader',
    rank: 'Diamond Hands',
    rankIcon: '💎',
    rankProgress: 65,
    nextRank: 'Capitalist',
    totalProfit: 12580.42,
    winRate: 68,
    totalTrades: 47,
    weeklyPerformance: 22.4,
    recentTrades: [
      { id: 1, symbol: 'AAPL', type: 'BUY', date: '2025-03-14', profit: 320.50 },
      { id: 2, symbol: 'TSLA', type: 'SELL', date: '2025-03-13', profit: -150.75 },
      { id: 3, symbol: 'MSFT', type: 'BUY', date: '2025-03-12', profit: 210.25 },
      { id: 4, symbol: 'AMZN', type: 'BUY', date: '2025-03-11', profit: 430.00 }
    ]
  };
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          Welcome back, <span>{userData.name}</span>
        </DashboardTitle>
        <DashboardActions>
          <ActionButton to="/trade-log">Log Trade</ActionButton>
          <ActionButton to="/journal">Write Journal</ActionButton>
        </DashboardActions>
      </DashboardHeader>
      
      <RankCard>
        <CardHeader>
          <CardTitle>Current Ranking</CardTitle>
          <CardAction to="/leaderboard">View Leaderboard</CardAction>
        </CardHeader>
        <RankInfo>
          <RankBadge>{userData.rankIcon}</RankBadge>
          <RankDetails>
            <RankTitle>{userData.rank}</RankTitle>
            <RankDescription>
              Weekly Performance: +{userData.weeklyPerformance}%
            </RankDescription>
            <ProgressBar>
              <Progress value={userData.rankProgress} />
            </ProgressBar>
            <RankDescription>
              {userData.rankProgress}% progress to {userData.nextRank}
            </RankDescription>
          </RankDetails>
        </RankInfo>
      </RankCard>
      
      <DashboardGrid>
        <DashboardCard>
          <CardHeader>
            <CardTitle>Performance Stats</CardTitle>
          </CardHeader>
          <StatGrid>
            <StatItem>
              <StatValue color={userData.totalProfit >= 0 ? '#10B981' : '#EF4444'}>
                ${userData.totalProfit.toLocaleString()}
              </StatValue>
              <StatLabel>Total Profit</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.winRate}%</StatValue>
              <StatLabel>Win Rate</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.totalTrades}</StatValue>
              <StatLabel>Total Trades</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue color="#F59E0B">
                {userData.weeklyPerformance}%
              </StatValue>
              <StatLabel>Weekly</StatLabel>
            </StatItem>
          </StatGrid>
        </DashboardCard>
        
        <DashboardCard>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardAction to="/trade-log">View All</CardAction>
          </CardHeader>
          <RecentTradesTable>
            <thead>
              <tr>
                <TableHeader>Symbol</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>P/L</TableHeader>
              </tr>
            </thead>
            <tbody>
              {userData.recentTrades.map(trade => (
                <tr key={trade.id}>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.date}</TableCell>
                  <TableCell>
                    <ProfitLossValue isProfit={trade.profit >= 0}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                    </ProfitLossValue>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </RecentTradesTable>
        </DashboardCard>
        
        <DashboardCard>
          <CardHeader>
            <CardTitle>Journal Activity</CardTitle>
            <CardAction to="/journal">View Journal</CardAction>
          </CardHeader>
          <div>
            <p style={{ color: '#B0B7C3', fontSize: '0.875rem', marginTop: '1rem' }}>
              You have 3 journal entries this week. Your last entry was on March 14, 2025.
            </p>
            <ActionButton to="/journal" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Write New Entry
            </ActionButton>
          </div>
        </DashboardCard>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
