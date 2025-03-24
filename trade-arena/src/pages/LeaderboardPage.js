import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard, getRankTiers, getUserRanking } from '../services/rankingService';

const LeaderboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeaderboardHeader = styled.div`
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

const LeaderboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const LeaderboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RankTiersCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  height: fit-content;
`;

const RankTiersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const RankTiersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RankTierItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.isUserTier ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.isUserTier ? props.theme.colors.secondary : 'transparent'};
`;

const RankTierIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.75rem;
  width: 2rem;
  text-align: center;
`;

const RankTierInfo = styled.div`
  flex: 1;
`;

const RankTierName = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 0.25rem;
`;

const RankTierRequirement = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const RankTierDescription = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const LeaderboardTableCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const TableRow = styled.tr`
  background-color: ${props => props.isCurrentUser ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
`;

const RankCell = styled(TableCell)`
  font-weight: ${props => props.theme.fontWeights.bold};
  width: 50px;
`;

const UserCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: 0.875rem;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const UserRank = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RankIcon = styled.span`
  font-size: 0.875rem;
`;

const PerformanceCell = styled(TableCell)`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.value >= 0 ? props.theme.colors.success : props.theme.colors.danger};
`;

const WinRateCell = styled(TableCell)`
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const ConsistencyCell = styled(TableCell)`
  font-weight: ${props => props.theme.fontWeights.medium};
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

const LeaderboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [rankTiers, setRankTiers] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [timeframe, setTimeframe] = useState('all-time');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadLeaderboardData();
  }, [timeframe]);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadUserRanking();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    loadRankTiers();
  }, []);
  
  const loadLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard(timeframe);
      setLeaderboard(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadUserRanking = async () => {
    try {
      const data = await getUserRanking();
      setUserRanking(data);
    } catch (err) {
      console.error('Failed to load user ranking:', err);
    }
  };
  
  const loadRankTiers = async () => {
    try {
      const data = await getRankTiers();
      setRankTiers(data);
    } catch (err) {
      console.error('Failed to load rank tiers:', err);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getRankIconForTier = (tier) => {
    const foundTier = rankTiers.find(t => t.tier === tier);
    return foundTier ? foundTier.icon : '🏆';
  };
  
  return (
    <LeaderboardContainer>
      <LeaderboardHeader>
        <LeaderboardTitle>
          Trader <span>Leaderboard</span>
        </LeaderboardTitle>
        
        <TimeframeSelector>
          <TimeframeButton 
            active={timeframe === 'weekly'} 
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </TimeframeButton>
          <TimeframeButton 
            active={timeframe === 'monthly'} 
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </TimeframeButton>
          <TimeframeButton 
            active={timeframe === 'all-time'} 
            onClick={() => setTimeframe('all-time')}
          >
            All-Time
          </TimeframeButton>
        </TimeframeSelector>
      </LeaderboardHeader>
      
      <LeaderboardGrid>
        <RankTiersCard>
          <RankTiersTitle>Rank Tiers</RankTiersTitle>
          
          <RankTiersList>
            {rankTiers.map((tier) => (
              <RankTierItem 
                key={tier.tier} 
                isUserTier={userRanking && userRanking.rankTier === tier.tier}
              >
                <RankTierIcon>{tier.icon}</RankTierIcon>
                <RankTierInfo>
                  <RankTierName>{tier.tier}</RankTierName>
                  <RankTierRequirement>{tier.requirement}</RankTierRequirement>
                  <RankTierDescription>{tier.description}</RankTierDescription>
                </RankTierInfo>
              </RankTierItem>
            ))}
          </RankTiersList>
        </RankTiersCard>
        
        <LeaderboardTableCard>
          {isLoading ? (
            <LoadingMessage>Loading leaderboard data...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <LeaderboardTable>
              <thead>
                <tr>
                  <TableHeader>Rank</TableHeader>
                  <TableHeader>Trader</TableHeader>
                  <TableHeader>Performance</TableHeader>
                  <TableHeader>Win Rate</TableHeader>
                  <TableHeader>Consistency</TableHeader>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <TableRow 
                    key={entry.userId} 
                    isCurrentUser={isAuthenticated && user && entry.userId === user.id}
                  >
                    <RankCell>{entry.rank}</RankCell>
                    <UserCell>
                      <UserAvatar>
                        {entry.profilePicture ? (
                          <img src={entry.profilePicture} alt={entry.displayName} />
                        ) : (
                          getInitials(entry.displayName)
                        )}
                      </UserAvatar>
                      <UserInfo>
                        <UserName>{entry.displayName}</UserName>
                        <UserRank>
                          <RankIcon>{getRankIconForTier(entry.rankTier)}</RankIcon>
                          {entry.rankTier}
                        </UserRank>
                      </UserInfo>
                    </UserCell>
                    <PerformanceCell value={entry.performance}>
                      {entry.performance >= 0 ? '+' : ''}{entry.performance.toFixed(2)}%
                    </PerformanceCell>
                    <WinRateCell>{entry.winRate.toFixed(1)}%</WinRateCell>
                    <ConsistencyCell>{entry.consistencyScore.toFixed(1)}</ConsistencyCell>
                  </TableRow>
                ))}
              </tbody>
            </LeaderboardTable>
          )}
        </LeaderboardTableCard>
      </LeaderboardGrid>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
