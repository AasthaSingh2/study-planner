import React from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import StudyPlanForm from './components/StudyPlanForm.tsx';
import StudyPlanCalendar from './components/StudyPlanCalendar.tsx';
import StudyPlanTable from './components/StudyPlanTable.tsx';

// Create a theme instance
const theme = createTheme({
  palette: {
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
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Study Planner
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            Your Personal Study Assistant
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <StudyPlanForm />
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <StudyPlanCalendar />
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <StudyPlanTable />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 