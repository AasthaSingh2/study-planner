import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import StudyPlanForm from './components/StudyPlanForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StudyPlanForm />
    </ThemeProvider>
  );
}

export default App; 