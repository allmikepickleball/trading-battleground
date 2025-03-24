import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getStockData, searchStocks, getPopularStocks } from '../services/stockService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MarketDataContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MarketDataHeader = styled.div`
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

const MarketDataTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
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
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.5rem;
`;

const SearchResultItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const StockSymbol = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const StockName = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MarketDataLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const StockCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: 0.25rem;
`;

const StockExchange = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StockPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const CurrentPrice = styled.div`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const PriceChange = styled.div`
  font-size: 0.875rem;
  color: ${props => props.value >= 0 ? props.theme.colors.success : props.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ChartContainer = styled.div`
  margin-bottom: 1.5rem;
  height: 300px;
`;

const TimeframeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

const StockDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DetailCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const InsightsSection = styled.div`
  margin-top: 2rem;
`;

const InsightsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InsightCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const InsightHeader = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 0.5rem;
`;

const InsightContent = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PopularStocksSection = styled.div`
  margin-top: 2rem;
`;

const PopularStocksTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
`;

const PopularStocksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PopularStockCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.theme.colors.primary};
  }
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

const MarketDataPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [popularStocks, setPopularStocks] = useState([]);
  const [timeframe, setTimeframe] = useState('1mo');
  const [interval, setInterval] = useState('1d');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const searchRef = useRef(null);
  
  // Load popular stocks on component mount
  useEffect(() => {
    loadPopularStocks();
  }, []);
  
  // Handle search query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);
  
  // Handle timeframe changes
  useEffect(() => {
    if (selectedStock) {
      loadStockData(selectedStock.symbol);
    }
  }, [timeframe, interval]);
  
  // Handle clicks outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const loadPopularStocks = async () => {
    try {
      const data = await getPopularStocks();
      setPopularStocks(data.results);
    } catch (err) {
      console.error('Failed to load popular stocks:', err);
    }
  };
  
  const handleSearch = async () => {
    try {
      const data = await searchStocks(searchQuery);
      setSearchResults(data.results);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to search stocks:', err);
    }
  };
  
  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setSearchQuery('');
    setShowResults(false);
    loadStockData(stock.symbol);
  };
  
  const loadStockData = async (symbol) => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getStockData(symbol, interval, timeframe);
      setStockData(data);
    } catch (err) {
      setError(err.message || 'Failed to load stock data');
      console.error('Failed to load stock data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTimeframeChange = (newTimeframe, newInterval) => {
    setTimeframe(newTimeframe);
    setInterval(newInterval);
  };
  
  // Format price with currency
  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };
  
  // Format percentage change
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  };
  
  // Format large numbers
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!stockData || !stockData.chart || !stockData.chart.series) {
      return null;
    }
    
    const series = stockData.chart.series;
    
    const labels = series.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const prices = series.map(item => item.close);
    
    // Calculate price change percentage for coloring
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChange = (lastPrice - firstPrice) / firstPrice;
    const lineColor = priceChange >= 0 ? '#10B981' : '#EF4444';
    
    return {
      labels,
      datasets: [
        {
          label: stockData.chart.meta.symbol,
          data: prices,
          borderColor: lineColor,
          backgroundColor: `${lineColor}20`,
          tension: 0.1,
          fill: true
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return formatPrice(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          }
        }
      }
    }
  };
  
  // Calculate price change
  const calculatePriceChange = () => {
    if (!stockData || !stockData.chart || !stockData.chart.series) {
      return { value: 0, percentage: 0 };
    }
    
    const series = stockData.chart.series;
    const firstPrice = series[0].close;
    const lastPrice = series[series.length - 1].close;
    
    const change = lastPrice - firstPrice;
    const percentage = change / firstPrice;
    
    return { value: change, percentage };
  };
  
  return (
    <MarketDataContainer>
      <MarketDataHeader>
        <MarketDataTitle>
          Market <span>Data</span>
        </MarketDataTitle>
        
        <SearchContainer ref={searchRef}>
          <SearchInput
            type="text"
            placeholder="Search for stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(searchResults.length > 0)}
          />
          
          {showResults && searchResults.length > 0 && (
            <SearchResults>
              {searchResults.map((stock) => (
                <SearchResultItem
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                >
                  <StockSymbol>{stock.symbol}</StockSymbol>
                  <StockName>{stock.name} ({stock.exchange})</StockName>
                </SearchResultItem>
              ))}
            </SearchResults>
          )}
        </SearchContainer>
      </MarketDataHeader>
      
      <MarketDataLayout>
        {isLoading ? (
          <LoadingMessage>Loading stock data...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : stockData ? (
          <StockCard>
            <StockHeader>
              <StockInfo>
                <StockTitle>{selectedStock.symbol}</StockTitle>
                <StockExchange>{selectedStock.name} • {selectedStock.exchange}</StockExchange>
              </StockInfo>
              
              {stockData.chart && stockData.chart.series && (
                <StockPrice>
                  <CurrentPrice>
                    {formatPrice(
                      stockData.chart.series[stockData.chart.series.length - 1].close,
                      stockData.chart.meta.currency
                    )}
                  </CurrentPrice>
                  
                  <PriceChange value={calculatePriceChange().percentage}>
                    {calculatePriceChange().percentage >= 0 ? '▲' : '▼'} 
                    {formatPrice(calculatePriceChange().value, stockData.chart.meta.currency)} 
                    ({formatPercentage(calculatePriceChange().percentage)})
                  </PriceChange>
                </StockPrice>
              )}
            </StockHeader>
            
            <TimeframeSelector>
              <TimeframeButton 
                active={timeframe === '5d' && interval === '1h'} 
                onClick={() => handleTimeframeChange('5d', '1h')}
              >
                5D
              </TimeframeButton>
              <TimeframeButton 
                active={timeframe === '1mo' && interval === '1d'} 
                onClick={() => handleTimeframeChange('1mo', '1d')}
              >
                1M
              </TimeframeButton>
              <TimeframeButton 
                active={timeframe === '3mo' && interval === '1d'} 
                onClick={() => handleTimeframeChange('3mo', '1d')}
              >
                3M
              </TimeframeButton>
              <TimeframeButton 
                active={timeframe === '6mo' && interval === '1d'} 
                onClick={() => handleTimeframeChange('6mo', '1d')}
              >
                6M
              </TimeframeButton>
              <TimeframeButton 
                active={timeframe === '1y' && interval === '1wk'} 
                onClick={() => <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>