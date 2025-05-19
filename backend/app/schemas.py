from typing import Dict, List
from pydantic import BaseModel, Field
from datetime import date

class StudyPlanRequest(BaseModel):
    subjects: List[str] = Field(
        ...,
        description="List of subject names",
        min_items=1,
        example=["Mathematics", "Physics", "Chemistry"]
    )
    
    chapters: Dict[str, List[str]] = Field(
        ...,
        description="Dictionary mapping subjects to their chapters",
        example={
            "Mathematics": ["Calculus", "Algebra", "Statistics"],
            "Physics": ["Mechanics", "Thermodynamics", "Electromagnetism"]
        }
    )
    
    exam_dates: Dict[str, str] = Field(
        ...,
        description="Dictionary mapping subjects to their exam dates (YYYY-MM-DD format)",
        example={
            "Mathematics": "2024-05-20",
            "Physics": "2024-05-25"
        }
    )
    
    daily_hours: int = Field(
        ...,
        description="Number of study hours available per day",
        ge=1,
        le=24,
        example=6
    )

class Chapter(BaseModel):
    name: str
    subject: str
    estimated_hours: float
    priority: int

class DailyPlan(BaseModel):
    date: date
    chapters: List[Chapter]
    total_hours: float

class StudyPlanResponse(BaseModel):
    daily_plans: List[DailyPlan]
    total_days: int
    total_hours: float
    subjects_covered: List[str] 