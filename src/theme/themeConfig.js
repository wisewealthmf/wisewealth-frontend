// Theme Configuration File
// Change theme settings from this single file to affect the entire website

export const themeConfig = {
  // Current active theme: 'light' or 'dark'
  activeTheme: 'light',
  
  // Light Theme Configuration
  light: {
    primary: '#2266a0',
    secondary: '#1a4d7a',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#999999',
    },
    accent: '#4a9fd8',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Dark Theme Configuration
  dark: {
    primary: '#2266a0',
    secondary: '#4a9fd8',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      light: '#808080',
    },
    accent: '#64b5f6',
    success: '#66bb6a',
    warning: '#ffa726',
    error: '#ef5350',
    border: '#404040',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Common settings
  common: {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
  }
};

// Helper function to get current theme
export const getCurrentTheme = () => {
  return themeConfig[themeConfig.activeTheme];
};

// Helper function to get all theme values including common
export const getTheme = () => {
  return {
    ...themeConfig[themeConfig.activeTheme],
    ...themeConfig.common,
  };
};

// Made with Bob
