from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Dict
import os
from .schemas import StudyPlanRequest, StudyPlanResponse, DailyPlan, Chapter

app = FastAPI(title="Study Planner API")

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://*.netlify.app"
).split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

def calculate_days_until_exam(exam_date: str) -> int:
    """Calculate days between today and exam date."""
    exam = datetime.strptime(exam_date, "%Y-%m-%d").date()
    today = datetime.now().date()
    return (exam - today).days

def distribute_chapters(
    subjects: List[str],
    chapters: Dict[str, List[str]],
    exam_dates: Dict[str, str],
    daily_hours: int
) -> StudyPlanResponse:
    """Generate a study plan by distributing chapters based on exam dates."""
    
    # Sort subjects by exam date
    sorted_subjects = sorted(
        subjects,
        key=lambda x: calculate_days_until_exam(exam_dates[x])
    )
    
    daily_plans: List[DailyPlan] = []
    today = datetime.now().date()
    
    # Process each subject
    for subject in sorted_subjects:
        exam_date = datetime.strptime(exam_dates[subject], "%Y-%m-%d").date()
        days_until_exam = (exam_date - today).days
        
        if days_until_exam <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"Exam date for {subject} has already passed"
            )
        
        # Calculate chapters per day
        subject_chapters = chapters[subject]
        chapters_per_day = max(1, len(subject_chapters) // days_until_exam)
        
        # Distribute chapters
        chapter_index = 0
        current_date = today
        
        while chapter_index < len(subject_chapters) and current_date < exam_date:
            # Create daily plan
            daily_chapters = []
            hours_allocated = 0
            
            # Add chapters for this day
            for _ in range(chapters_per_day):
                if chapter_index >= len(subject_chapters):
                    break
                    
                chapter = Chapter(
                    name=subject_chapters[chapter_index],
                    subject=subject,
                    estimated_hours=daily_hours / chapters_per_day,
                    priority=1 if subject == sorted_subjects[0] else 2
                )
                daily_chapters.append(chapter)
                hours_allocated += chapter.estimated_hours
                chapter_index += 1
            
            # Add the daily plan
            daily_plans.append(DailyPlan(
                date=current_date,
                chapters=daily_chapters,
                total_hours=hours_allocated
            ))
            
            current_date += timedelta(days=1)
    
    return StudyPlanResponse(
        daily_plans=daily_plans,
        total_days=len(daily_plans),
        total_hours=sum(plan.total_hours for plan in daily_plans),
        subjects_covered=sorted_subjects
    )

@app.post("/api/generate-plan", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    """
    Generate a personalized study plan based on:
    - List of subjects
    - Chapters for each subject
    - Exam dates
    - Available daily study hours
    """
    try:
        # Validate that all subjects have corresponding chapters and exam dates
        for subject in request.subjects:
            if subject not in request.chapters:
                raise HTTPException(
                    status_code=400,
                    detail=f"No chapters provided for subject: {subject}"
                )
            if subject not in request.exam_dates:
                raise HTTPException(
                    status_code=400,
                    detail=f"No exam date provided for subject: {subject}"
                )
        
        return distribute_chapters(
            request.subjects,
            request.chapters,
            request.exam_dates,
            request.daily_hours
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 