export const theme = {
  colors: {
    primary: '#1E3A8A',       // Dark blue
    secondary: '#D4AF37',     // Gold accent
    background: '#0A0E17',    // Very dark blue/black
    backgroundAlt: '#141B2D', // Slightly lighter dark blue
    text: '#FFFFFF',          // White text
    textSecondary: '#B0B7C3', // Light gray text
    success: '#10B981',       // Green for profits
    danger: '#EF4444',        // Red for losses
    warning: '#F59E0B',       // Amber for warnings
    info: '#3B82F6',          // Blue for info
    border: '#2D3748',        // Dark border color
    chart: {
      grid: '#1E293B',
      line: '#3B82F6',
      profit: '#10B981',
      loss: '#EF4444'
    }
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif"
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease'
  }
};
