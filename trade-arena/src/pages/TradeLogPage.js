import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { createTrade, getUserTrades, updateTrade, deleteTrade } from '../services/tradeService';

const TradeLogContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TradeLogHeader = styled.div`
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

const TradeLogTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const AddTradeButton = styled.button`
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

const TradeLogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const TradeFormCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const TradeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
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

const Select = styled.select`
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
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

const CancelButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-top: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const TradeListCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const TradeListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TradeListTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const TradeFilters = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TradeTable = styled.table`
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

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const TradeLogPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTradeId, setEditingTradeId] = useState(null);
  
  const initialFormState = {
    tradeType: 'BUY',
    assetType: 'Stocks',
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    leverage: '1',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  // Load trades on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadTrades();
    }
  }, [isAuthenticated]);
  
  // Update filtered trades when trades or filter changes
  useEffect(() => {
    filterTrades();
  }, [trades, activeFilter]);
  
  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const tradesData = await getUserTrades();
      setTrades(tradesData);
    } catch (err) {
      setError(err.message || 'Failed to load trades');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterTrades = () => {
    if (activeFilter === 'all') {
      setFilteredTrades(trades);
    } else if (activeFilter === 'profit') {
      setFilteredTrades(trades.filter(trade => trade.profitLoss > 0));
    } else if (activeFilter === 'loss') {
      setFilteredTrades(trades.filter(trade => trade.profitLoss <= 0));
    }
  };
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingTradeId(null);
  };
  
  const handleEditTrade = (trade) => {
    setEditingTradeId(trade._id);
    setFormData({
      tradeType: trade.tradeType,
      assetType: trade.assetType,
      symbol: trade.symbol,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      stopLoss: trade.stopLoss || '',
      takeProfit: trade.takeProfit || '',
      leverage: trade.leverage,
      quantity: trade.quantity,
      date: new Date(trade.date).toISOString().split('T')[0],
      notes: trade.notes || ''
    });
  };
  
  const handleDeleteTrade = async (tradeId) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setIsLoading(true);
      try {
        await deleteTrade(tradeId);
        setTrades(trades.filter(trade => trade._id !== tradeId));
        setSuccess('Trade deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete trade');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!formData.symbol || !formData.entryPrice || !formData.exitPrice || !formData.quantity || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const tradeData = {
        ...formData,
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: parseFloat(formData.exitPrice),
        stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
        takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
        leverage: parseFloat(formData.leverage),
        quantity: parseFloat(formData.quantity)
      };
      
      let result;
      
      if (editingTradeId) {
        // Update existing trade
        result = await updateTrade(editingTradeId, tradeData);
        setTrades(trades.map(trade => trade._id === editingTradeId ? result : trade));
        setSuccess('Trade updated successfully');
      } else {
        // Create new trade
        result = await createTrade(tradeData);
        setTrades([result, ...trades]);
        setSuccess('Trade logged successfully');
      }
      
      // Reset form
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to save trade');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <TradeLogContainer>
      <TradeLogHeader>
        <TradeLogTitle>
          Trade <span>Log</span>
        </TradeLogTitle>
      </TradeLogHeader>
      
      <TradeLogGrid>
        <TradeFormCard>
          <FormTitle>{editingTradeId ? 'Edit Trade' : 'Log New Trade'}</FormTitle>
          <TradeForm onSubmit={onSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="tradeType">Trade Type</Label>
                <Select
                  id="tradeType"
                  name="tradeType"
                  value={formData.tradeType}
                  onChange={onChange}
                  disabled={isLoading}
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="assetType">Asset Type</Label>
                <Select
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={onChange}
                  disabled={isLoading}
                >
                  <option value="Stocks">Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Forex">Forex</option>
                  <option value="Options">Options</option>
                  <option value="Futures">Futures</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="symbol">Ticker/Symbol</Label>
              <Input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={onChange}
                placeholder="e.g., AAPL, BTC, EUR/USD"
                disabled={isLoading}
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  type="number"
                  id="entryPrice"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={onChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={isLoading}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  type="number"
                  id="exitPrice"
                  name="exitPrice"
                  value={formData.exitPrice}
                  onChange={onChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={isLoading}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  type="number"
                  id="stopLoss"
                  name="stopLoss"
                  value={formData.stopLoss}
                  onChange={onChange}
                  placeholder="0.00"
                  step="0.01"
                  disabled={isLoading}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  type="number"
                  id="takeProfit"
                  name="takeProfit"
                  value={formData.takeProfit}
                <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>