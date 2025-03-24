import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { createMessage, getMessages, getMessageReplies, toggleLike, deleteMessage } from '../services/messageService';

const MessageBoardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const MessageBoardHeader = styled.div`
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

const MessageBoardTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const MessageBoardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const MessageFormCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  align-self: flex-end;
  width: 150px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    color: #000;
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundAlt};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
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

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const MessageDate = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MessageActions = styled.div`
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

const MessageContent = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const MessageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const MessageStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.colors.secondary : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ReplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const RepliesContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReplyCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ReplyForm = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadMoreButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: ${props => props.theme.transitions.default};
  margin-top: 1rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const MessageBoardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    loadMessages();
  }, []);
  
  const loadMessages = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getMessages(page);
      
      if (page === 1) {
        setMessages(data.messages);
      } else {
        setMessages([...messages, ...data.messages]);
      }
      
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMoreMessages = () => {
    if (pagination.page < pagination.totalPages) {
      loadMessages(pagination.page + 1);
    }
  };
  
  const loadReplies = async (messageId) => {
    try {
      const data = await getMessageReplies(messageId);
      
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message._id === messageId 
            ? { ...message, replies: data.replies }
            : message
        )
      );
      
      setExpandedReplies(prev => ({
        ...prev,
        [messageId]: true
      }));
      
    } catch (err) {
      console.error('Failed to load replies:', err);
    }
  };
  
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to post messages');
      return;
    }
    
    if (!messageContent.trim()) {
      setError('Message content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const newMessage = await createMessage({ content: messageContent });
      
      // Add user data to new message
      newMessage.user = {
        _id: user.id,
        username: user.username,
        displayName: user.displayName,
        profilePicture: user.profilePicture
      };
      
      setMessages([newMessage, ...messages]);
      setMessageContent('');
      setSuccess('Message posted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to post message');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitReply = async (messageId) => {
    if (!isAuthenticated) {
      setError('You must be logged in to reply');
      return;
    }
    
    if (!replyContent.trim()) {
      setError('Reply content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const newReply = await createMessage({ 
        content: replyContent,
        parentMessage: messageId
      });
      
      // Add user data to new reply
      newReply.user = {
        _id: user.id,
        username: user.username,
        displayName: user.displayName,
        profilePicture: user.profilePicture
      };
      
      // Update the message with the new reply
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message._id === messageId 
            ? { 
                ...message, 
                replies: [...(message.replies || []), newReply]
              }
            : message
        )
      );
      
      setReplyContent('');
      setReplyingTo(null);
      setSuccess('Reply posted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleToggleLike = async (messageId) => {
    if (!isAuthenticated) {
      setError('You must be logged in to like messages');
      return;
    }
    
    try {
      const result = await toggleLike(messageId);
      
      // Update the message with the new like status
      setMessages(prevMessages => 
        prevMessages.map(message => {
          if (message._id === messageId) {
            return {
              ...message,
              likes: result.liked 
                ? [...message.likes, user.id]
                : message.likes.filter(id => id !== user.id)
            };
          }
          
          // Check if it's a reply
          if (message.replies) {
            const updatedReplies = message.replies.map(reply => 
              reply._id === messageId
                ? {
                    ...reply,
                    likes: result.liked 
                      ? [...reply.likes, user.id]
                      : reply.likes.filter(id => id !== user.id)
                  }
                : reply
            );
            
            return {
              ...message,
              replies: updatedReplies
            };
          }
          
          return message;
        })
      );
      
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };
  
  const handleDeleteMessage = async (messageId, isReply = false, parentId = null) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
        
        if (isReply && parentId) {
          // Remove the reply from its parent message
          setMessages(prevMessages => 
            prevMessages.map(message => 
              message._id === parentId
                ? {
                    ...message,
                    replies: message.replies.filter(reply => reply._id !== messageId)
                  }
                : message
            )
          );
        } else {
          // Remove the message from the list
          setMessages(prevMessages => 
            prevMessages.filter(message => message._id !== messageId)
          );
        }
        
        setSuccess('Message deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to delete message');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const isLikedByUser = (likes) => {
    return isAuthenticated && likes.includes(user.id);
  };
  
  const isOwnMessage = (messageUserId) => {
    return isAuthenticated && user.id === messageUserId;
  };
  
  const toggleReplies = (messageId) => {
    if (expandedReplies[messageId]) {
      setExpandedReplies(prev => ({
        ...prev,
        [messageId]: false
      }));
    } else {
      loadReplies(messageId);
    }
  };
  
  return (
    <MessageBoardContainer>
      <MessageBoardHeader>
        <MessageBoardTitle>
          Message <span>Board</span>
        </MessageBoardTitle>
      </MessageBoardHeader>
      
      <MessageBoardGrid>
        {isAuthenticated && (
          <MessageFormCard>
            <MessageForm onSubmit={handleSubmitMessage}>
              <TextArea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Share your thoughts with the trading community..."
                disabled={isSubmitting}
              />
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <SubmitButton 
                type="submit"
                disabled={isSubmitting || !messageContent.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Message'}
              </SubmitButton>
            </MessageForm>
          </MessageFormCard>
        )}
        
        <MessageList>
          {isLoading && messages.length === 0 ? (
            <LoadingMessage>Loading messages...</LoadingMessage>
          ) : messages.length === 0 ? (
            <MessageCard>
              <MessageContent>
                No messages yet. Be the first to post!
              </MessageContent>
            </MessageCard>
          ) : (
            <>
              {messages.map(message => (
                <MessageCard key={message._id}>
                  <MessageHeader>
                    <UserInfo>
                      <UserAvatar>
                        {message.user.profilePicture ? (
         <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>