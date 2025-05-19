// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
// } from '@mui/material';
// import { format } from 'date-fns';

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

// interface StudyPlanTableProps {
//   plan: StudyPlanResponse | null;
// }

// const StudyPlanTable: React.FC<StudyPlanTableProps> = ({ plan }) => {
//   if (!plan) {
//     return null;
//   }

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Your Study Plan
//       </Typography>
      
//       <Box sx={{ mb: 2 }}>
//         <Typography variant="body1" color="text.secondary">
//           Total Days: {plan.total_days} | Total Hours: {plan.total_hours.toFixed(1)}
//         </Typography>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Subject</TableCell>
//               <TableCell>Chapter</TableCell>
//               <TableCell align="right">Hours</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {plan.daily_plans.map((dailyPlan, index) => (
//               <React.Fragment key={index}>
//                 {dailyPlan.chapters.map((chapter, chapterIndex) => (
//                   <TableRow
//                     key={`${index}-${chapterIndex}`}
//                     sx={{
//                       backgroundColor: chapter.priority === 1 ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
//                     }}
//                   >
//                     {chapterIndex === 0 && (
//                       <TableCell rowSpan={dailyPlan.chapters.length}>
//                         {format(new Date(dailyPlan.date), 'MMM dd, yyyy')}
//                       </TableCell>
//                     )}
//                     <TableCell>{chapter.subject}</TableCell>
//                     <TableCell>{chapter.name}</TableCell>
//                     <TableCell align="right">
//                       {chapter.estimated_hours.toFixed(1)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     sx={{
//                       backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     Daily Total: {dailyPlan.total_hours.toFixed(1)} hours
//                   </TableCell>
//                 </TableRow>
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default StudyPlanTable; 
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
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

interface StudyPlanTableProps {
  plan: StudyPlanResponse | null;
}

const StudyPlanTable: React.FC<StudyPlanTableProps> = ({ plan }) => {
  if (!plan) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Your Study Plan
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Total Days: {plan.total_days} | Total Hours: {plan.total_hours.toFixed(1)}
        </Typography>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Chapter</TableCell>
                <TableCell align="right">Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plan.daily_plans.map((dailyPlan, index) => (
                <React.Fragment key={index}>
                  {dailyPlan.chapters.map((chapter, chapterIndex) => (
                    <TableRow
                      key={`${index}-${chapterIndex}`}
                      sx={{
                        backgroundColor:
                          chapter.priority === 1 ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                        borderLeft:
                          chapter.priority === 1 ? '4px solid #1976d2' : undefined,
                      }}
                    >
                      {chapterIndex === 0 && (
                        <TableCell rowSpan={dailyPlan.chapters.length}>
                          {format(new Date(dailyPlan.date), 'MMM dd, yyyy')}
                        </TableCell>
                      )}
                      <TableCell>{chapter.subject}</TableCell>
                      <TableCell>{chapter.name}</TableCell>
                      <TableCell align="right">
                        {chapter.estimated_hours.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                      <Typography fontWeight="bold">
                        Daily Total: {dailyPlan.total_hours.toFixed(1)} hours
                      </Typography>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StudyPlanTable;
