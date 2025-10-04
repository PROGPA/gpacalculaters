import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { TrendingUp, BookOpen, GraduationCap } from 'lucide-react';
import { 
  CalculatorLayout, 
  Course, 
  gradeScale 
} from '../shared/calculator-layout';

function SemesterGPACalculator() {
  // Initialize with one semester containing 4 empty courses - exact match to homepage
  const [semesters, setSemesters] = useState<Course[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [gpa, setGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  const calculateGPA = useCallback(() => {
    const allCourses = semesters.flat();
    const validCourses = allCourses.filter(course => 
      course.name && course.grade && course.credits > 0
    );
    
    if (validCourses.length === 0) {
      setGPA(0);
      setTotalCredits(0);
      return;
    }

    const totalPoints = validCourses.reduce(
      (sum, course) => sum + (course.gradePoints * course.credits), 0
    );
    const totalCreds = validCourses.reduce(
      (sum, course) => sum + course.credits, 0
    );
    
    const calculatedGPA = totalPoints / totalCreds;
    setGPA(parseFloat(calculatedGPA.toFixed(3)));
    setTotalCredits(totalCreds);

    // Celebration for high GPA
    if (calculatedGPA >= 3.8 && validCourses.length >= 3) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Outstanding Semester GPA! Keep up the excellent work!');
    }
  }, [semesters]);

  useEffect(() => {
    calculateGPA();
  }, [calculateGPA]);

  const addCourse = (semesterIndex: number) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = [...updatedSemesters[semesterIndex], newCourse];
    setSemesters(updatedSemesters);
    toast.success('New course added!');
  };

  // No addSemester function - Semester GPA only supports ONE semester

  const updateCourse = (semesterIndex: number, courseId: string, field: keyof Course, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].map(course => {
      if (course.id === courseId) {
        const updatedCourse = { ...course, [field]: value };
        if (field === 'grade') {
          updatedCourse.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
        }
        return updatedCourse;
      }
      return course;
    });
    setSemesters(updatedSemesters);
  };

  const removeCourse = (semesterIndex: number, courseId: string) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].length > 1) {
      updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].filter(course => course.id !== courseId);
      setSemesters(updatedSemesters);
      toast.success('Course removed');
    }
  };

  const resetCalculator = () => {
    setSemesters([
      [
        { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
      ]
    ]);
    setGPA(0);
    setTotalCredits(0);
    toast.success('Calculator reset');
  };

  // Quick links specific to Semester GPA Calculator
  const quickLinks = (
    <>
      <Link to="/calculators/cumulative-gpa">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <TrendingUp className="w-4 h-4 mr-2" />
          Cumulative GPA Calculator
        </Button>
      </Link>
      <Link to="/calculators/college-gpa">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <GraduationCap className="w-4 h-4 mr-2" />
          College GPA Calculator
        </Button>
      </Link>
    </>
  );

  return (
    <CalculatorLayout
      title="Semester GPA Calculator"
      description="Track your semester performance and plan your academic progress. Enter your course grades and credit hours to get instant results."
      semesters={semesters}
      gpa={gpa}
      totalCredits={totalCredits}
      gpaLabel="Semester GPA"
      onAddCourse={addCourse}
      onAddSemester={undefined}
      onUpdateCourse={updateCourse}
      onRemoveCourse={removeCourse}
      onCalculateGPA={calculateGPA}
      onReset={resetCalculator}
      quickLinks={quickLinks}
      hideSemesterButton={true}
    />
  );
}

export { SemesterGPACalculator };