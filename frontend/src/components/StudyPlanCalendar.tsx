// import React from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Tooltip,
//   Chip,
//   Stack,
// } from '@mui/material';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { format, isSameDay } from 'date-fns';

// interface Chapter {
//   name: string;
//   subject: string;
//   estimated_hours: number;
//   priority: number;
// }

// interface DailyPlan {
//   date: string;
//   chapters: Chapter[];
//   total_hours: number;
// }

// interface StudyPlanResponse {
//   daily_plans: DailyPlan[];
//   total_days: number;
//   total_hours: number;
//   subjects_covered: string[];
// }

// interface StudyPlanCalendarProps {
//   plan: StudyPlanResponse | null;
// }

// const StudyPlanCalendar: React.FC<StudyPlanCalendarProps> = ({ plan }) => {
//   if (!plan) {
//     return null;
//   }

//   // Create a map of dates to their daily plans for easy lookup
//   const planMap = new Map(
//     plan.daily_plans.map(dailyPlan => [
//       format(new Date(dailyPlan.date), 'yyyy-MM-dd'),
//       dailyPlan
//     ])
//   );

//   // Custom day rendering function
//   const renderDay = (day: Date) => {
//     const dateKey = format(day, 'yyyy-MM-dd');
//     const dailyPlan = planMap.get(dateKey);

//     if (!dailyPlan) {
//       return null;
//     }

//     return (
//       <Box
//         sx={{
//           height: '100%',
//           width: '100%',
//           position: 'relative',
//           p: 0.5,
//         }}
//       >
//         <Tooltip
//           title={
//             <Box>
//               <Typography variant="subtitle2" gutterBottom>
//                 {format(day, 'MMMM dd, yyyy')}
//               </Typography>
//               <Stack spacing={0.5}>
//                 {dailyPlan.chapters.map((chapter, index) => (
//                   <Typography key={index} variant="body2">
//                     • {chapter.subject}: {chapter.name} ({chapter.estimated_hours.toFixed(1)}h)
//                   </Typography>
//                 ))}
//                 <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
//                   Total: {dailyPlan.total_hours.toFixed(1)}h
//                 </Typography>
//               </Stack>
//             </Box>
//           }
//         >
//           <Box
//             sx={{
//               height: '100%',
//               width: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 0.5,
//             }}
//           >
//             {dailyPlan.chapters.map((chapter, index) => (
//               <Chip
//                 key={index}
//                 label={`${chapter.subject}: ${chapter.name}`}
//                 size="small"
//                 sx={{
//                   maxWidth: '100%',
//                   height: '20px',
//                   fontSize: '0.7rem',
//                   backgroundColor: chapter.priority === 1 
//                     ? 'rgba(25, 118, 210, 0.1)' 
//                     : 'rgba(0, 0, 0, 0.04)',
//                   '& .MuiChip-label': {
//                     px: 0.5,
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                   },
//                 }}
//               />
//             ))}
//           </Box>
//         </Tooltip>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Calendar View
//       </Typography>

//       <Paper elevation={3} sx={{ p: 2 }}>
//         <DateCalendar
//           sx={{
//             width: '100%',
//             '& .MuiPickersDay-root': {
//               height: '100px',
//               width: '100%',
//               margin: 0,
//               padding: 0,
//             },
//             '& .MuiPickersDay-dayWithMargin': {
//               margin: 0,
//             },
//           }}
//           slots={{
//             day: renderDay,
//           }}
//           slotProps={{
//             day: {
//               sx: {
//                 height: '100px',
//                 width: '100%',
//                 margin: 0,
//                 padding: 0,
//               },
//             },
//           }}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default StudyPlanCalendar; 
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Chip,
  Stack,
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

  const CustomDay = (props: PickersDayProps<unknown>) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateKey = format(day, 'yyyy-MM-dd');
    const dailyPlan = planMap.get(dateKey);

    return (
      <Tooltip
        title={
          dailyPlan ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {format(day, 'MMMM dd, yyyy')}
              </Typography>
              <Stack spacing={0.5}>
                {dailyPlan.chapters.map((chapter, index) => (
                  <Typography key={index} variant="body2">
                    • {chapter.subject}: {chapter.name} ({chapter.estimated_hours.toFixed(1)}h)
                  </Typography>
                ))}
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                  Total: {dailyPlan.total_hours.toFixed(1)}h
                </Typography>
              </Stack>
            </Box>
          ) : ''
        }
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
          }}
        >
          <PickersDay
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            {...other}
            sx={{
              height: '100px',
              width: '100%',
              margin: 0,
              padding: 0.5,
            }}
          />
          {dailyPlan && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, p: 0.3 }}>
              {dailyPlan.chapters.map((chapter, index) => (
                <Chip
                  key={index}
                  label={`${chapter.subject}: ${chapter.name}`}
                  size="small"
                  sx={{
                    maxWidth: '100%',
                    height: '20px',
                    fontSize: '0.7rem',
                    backgroundColor: chapter.priority === 1
                      ? 'rgba(25, 118, 210, 0.1)'
                      : 'rgba(0, 0, 0, 0.04)',
                    '& .MuiChip-label': {
                      px: 0.5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
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
