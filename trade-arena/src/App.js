import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import theme from './styles/theme';
import GlobalStyles from './styles/global';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TradeLogPage from './pages/TradeLogPage';
import LeaderboardPage from './pages/LeaderboardPage';
import MessageBoardPage from './pages/MessageBoardPage';
import JournalPage from './pages/JournalPage';
import MarketDataPage from './pages/MarketDataPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Private Route Component
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <AdminProvider>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } />
                <Route path="/trade-log" element={
                  <PrivateRoute>
                    <TradeLogPage />
                  </PrivateRoute>
                } />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/message-board" element={<MessageBoardPage />} />
                <Route path="/journal" element={
                  <PrivateRoute>
                    <JournalPage />
                  </PrivateRoute>
                } />
                <Route path="/market-data" element={<MarketDataPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
