import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface Chapter {
  name: string;
  subject: string;
  estimated_hours: number;
  priority: number;
}

interface DailyPlan {
  date: string;
  chapters: Chapter[];
  total_hours: number;
}

interface StudyPlanResponse {
  daily_plans: DailyPlan[];
  total_days: number;
  total_hours: number;
  subjects_covered: string[];
}

interface StudyPlanCalendarProps {
  plan: StudyPlanResponse | null;
}

const StudyPlanCalendar: React.FC<StudyPlanCalendarProps> = ({ plan }) => {
  if (!plan) {
    return null;
  }

  const planMap = new Map(
    plan.daily_plans.map(dailyPlan => [
      format(new Date(dailyPlan.date), 'yyyy-MM-dd'),
      dailyPlan
    ])
  );

  const CustomDay = (props: PickersDayProps<Date>) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateKey = format(day as Date, 'yyyy-MM-dd');
    const dailyPlan = planMap.get(dateKey);

    return (
      <Tooltip
        title={
          dailyPlan
            ? `${dailyPlan.chapters.length} chapter${dailyPlan.chapters.length > 1 ? 's' : ''}, ${dailyPlan.total_hours} hr${dailyPlan.total_hours > 1 ? 's' : ''}`
            : ''
        }
        arrow
      >
        <span>
          <Badge
            key={dateKey}
            color="primary"
            variant={dailyPlan ? 'dot' : 'standard'}
          >
            <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
          </Badge>
        </span>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Calendar View
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <DateCalendar
          sx={{
            width: '100%',
            '& .MuiPickersDay-root': {
              height: '100px',
              width: '100%',
              margin: 0,
              padding: 0,
            },
            '& .MuiPickersDay-dayWithMargin': {
              margin: 0,
            },
          }}
          slots={{
            day: CustomDay,
          }}
        />
      </Paper>
    </Box>
  );
};

export default StudyPlanCalendar;

