import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { 
  createJournalEntry, 
  getUserJournalEntries, 
  getJournalEntryById, 
  getJournalEntriesByDate, 
  updateJournalEntry, 
  deleteJournalEntry 
} from '../services/journalService';

const JournalContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const JournalHeader = styled.div`
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

const JournalTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const AddEntryButton = styled.button`
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

const JournalLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const CalendarCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  height: fit-content;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const CalendarNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Weekday = styled.div`
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.5rem 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  position: relative;
  
  background-color: ${props => {
    if (props.isSelected) return props.theme.colors.primary;
    if (props.hasEntry) return 'rgba(212, 175, 55, 0.2)';
    if (props.isToday) return 'rgba(59, 130, 246, 0.2)';
    return 'transparent';
  }};
  
  color: ${props => {
    if (props.isSelected) return props.theme.colors.text;
    if (props.isCurrentMonth) return props.theme.colors.text;
    return props.theme.colors.textSecondary;
  }};
  
  font-weight: ${props => {
    if (props.isToday || props.isSelected) return props.theme.fontWeights.bold;
    return props.theme.fontWeights.normal;
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.isSelected) return props.theme.colors.primary;
      return 'rgba(255, 255, 255, 0.1)';
    }};
  }
  
  &::after {
    content: '';
    display: ${props => (props.hasProfit || props.hasLoss) ? 'block' : 'none'};
    position: absolute;
    bottom: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.hasProfit ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EntryCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EntryDate = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
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

const EntryContent = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const EntryFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const EntryStats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.color || props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

const VisibilityToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ToggleSwitch = styled.div`
  width: 40px;
  height: 20px;
  background-color: ${props => props.isPublic ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isPublic ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.text};
    transition: ${props => props.theme.transitions.default};
  }
`;

const EntryForm = styled.form`
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.default};
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.2);
  }
`;

const FileUploadContainer = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FileUploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const ScreenshotsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ScreenshotThumbnail = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveScreenshotButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: #000;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: 1rem;
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const JournalPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [entryContent, setEntryContent] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load calendar data on component mount and when selected date changes
  useEffect(() => {
    if (isAuthenticated) {
      loadCalendarData();
    }
  }, [isAuthenticated, selectedDate]);
  
  // Load journal entries when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadJournalEntries();
    }
  }, [isAuthenticated]);
  
  // Load entry for selected date
  useEffect(() => {
    if (calendarData.length > 0) {
      const selectedDay = calendarData.find(day => 
        isSameDay(new Date(day.date), selectedDate)
      );
      
      if (selectedDay && selectedDay.hasEntry && selectedDay.entryId) {
        loadJournalEntry(selectedDay.entryId);
      } else {
        setSelectedEntry(null);
      }
    }
  }, [calendarData, selectedDate]);
  
  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; // API expects 1-indexed month
      
      const data = await getJournalEntriesByDate(year, month);
      setCalendarData(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadJournalEntries = async () => {
    try {
      const entries = await getUserJournalEntries();
      setJournalEntries(entries);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    }
  };
  
  const loadJournalEntry = async (entryId) => {
    try {
      const entry = await getJournalEntryById(entryId);
      setSelectedEntry(entry);
    } catch (err) {
      console.error('Failed to load journal entry:', err);
    }
  };
  
  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  
  const handleDayClick = (day) => {
    setSelectedDate(new Date(day.date));
  };
  
  const handleAddEntry = () => {
    setEntryContent('');
    setScreenshots([]);
    setIsPublic(false);
    setIsAddingEntry(true);
    setIsEditingEntry(false);
  };
  
  const handleEditEntry = () => {
    if (selectedEntry) {
      setEntryContent(selectedEntry.content);
      setScreenshots(selectedEntry.screenshots || []);
      setIsPublic(selectedEntry.isPublic);
      setIsAddingEntry(false);
      setIsEditingEntry(true);
    }
  };
  
  const handleCancelEntry = () => {
    setIsAddingEntry(false);
    setIsEditingEntry(false);
  };
  
  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      setIsSubmitting(true);
      try {
        await deleteJournalEntry(selectedEntry._id);
        
        setSelectedEntry(null);
        setSuccess('Journal entry deleted successfully');
        
        // Reload calendar data
        loadCalendarData();
        loadJournalEntries();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete journal entry');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // For now, we'll just store the file objects
    // In a real app, you would upload these to a server and store URLs
    setScreenshots([...screenshots, ...files]);
  };
  
  const handleRemoveScreenshot = (index) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };
  
  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    
    if (!entryContent.trim()) {
      setError('Journal entry content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const entryData = {
        date: selectedDate.toISOString(),
        content: entryContent,
        screenshots: [], // In a real app, you would upload files and store URLs
        isPublic
      };
      
      let result;
      
      if (isEditingEntry && selectedEntry) {
        // Update existing entry
        result = await updateJournalEntry(selectedEntry._id, entryData);
        setSuccess('Journal entry updated successfully');
      } else {
        // Create new entry
        result = await createJournalEntry(entryData);
        setSuccess('Journal entry created successfully');
      }
      
      // Update state
      setSelect<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>