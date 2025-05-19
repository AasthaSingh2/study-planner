import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Grid,
  Container,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TableChartIcon from '@mui/icons-material/TableChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { studyPlanApi } from '../services/api';
import StudyPlanTable from './StudyPlanTable';
import StudyPlanCalendar from './StudyPlanCalendar';

interface Subject {
  name: string;
  chapters: string[];
  examDate: Date | null;
}

const StudyPlanForm: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: '', chapters: [''], examDate: null },
  ]);
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleSubjectChange = (index: number, field: keyof Subject, value: any) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleChapterChange = (subjectIndex: number, chapterIndex: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', chapters: [''], examDate: null }]);
  };

  const removeSubject = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const addChapter = (subjectIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters.push('');
    setSubjects(newSubjects);
  };

  const removeChapter = (subjectIndex: number, chapterIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters = newSubjects[subjectIndex].chapters.filter(
      (_, i) => i !== chapterIndex
    );
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStudyPlan(null);

    try {
      const formattedData = {
        subjects: subjects.map(s => s.name),
        chapters: subjects.reduce((acc, subject) => ({
          ...acc,
          [subject.name]: subject.chapters.filter(c => c.trim() !== '')
        }), {}),
        exam_dates: subjects.reduce((acc, subject) => ({
          ...acc,
          [subject.name]: subject.examDate?.toISOString().split('T')[0]
        }), {}),
        daily_hours: dailyHours
      };

      const response = await studyPlanApi.generatePlan(formattedData);
      
      if (!response.data || !response.data.daily_plans || response.data.daily_plans.length === 0) {
        setSnackbar({
          open: true,
          message: 'No study plan could be generated with the given inputs. Please adjust your schedule.',
          severity: 'info',
        });
        return;
      }

      setStudyPlan(response.data);
      setSnackbar({
        open: true,
        message: 'Study plan generated successfully!',
        severity: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
        'Failed to generate study plan. Please check your connection and try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'table' | 'calendar' | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Study Plan
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {subjects.map((subject, subjectIndex) => (
            <Box key={subjectIndex} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(subjectIndex, 'name', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Exam Date"
                      value={subject.examDate}
                      onChange={(date) => handleSubjectChange(subjectIndex, 'examDate', date)}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <IconButton
                    color="error"
                    onClick={() => removeSubject(subjectIndex)}
                    disabled={subjects.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>

                {subject.chapters.map((chapter, chapterIndex) => (
                  <Grid item xs={12} key={chapterIndex}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Chapter ${chapterIndex + 1}`}
                        value={chapter}
                        onChange={(e) => handleChapterChange(subjectIndex, chapterIndex, e.target.value)}
                        required
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeChapter(subjectIndex, chapterIndex)}
                        disabled={subject.chapters.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addChapter(subjectIndex)}
                    variant="outlined"
                    size="small"
                  >
                    Add Chapter
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Daily Study Hours"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              inputProps={{ min: 1, max: 24 }}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addSubject}
            >
              Add Subject
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Generating Plan...' : 'Generate Study Plan'}
            </Button>
          </Box>
        </form>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {studyPlan && !loading && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Total Days: {studyPlan.total_days} | Total Hours: {studyPlan.total_hours.toFixed(1)}
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
              >
                <ToggleButton value="table" aria-label="table view">
                  <TableChartIcon />
                </ToggleButton>
                <ToggleButton value="calendar" aria-label="calendar view">
                  <CalendarMonthIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {viewMode === 'table' ? (
              <StudyPlanTable plan={studyPlan} />
            ) : (
              <StudyPlanCalendar plan={studyPlan} />
            )}
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default StudyPlanForm; 