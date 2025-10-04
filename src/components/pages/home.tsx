import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CircularMeter } from '../ui/circular-meter';
import { toast } from 'sonner@2.0.3';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  Calculator,
  Plus,
  Trash2,
  ChevronDown,
  Info,
  BookOpen,
  GraduationCap,
  PieChartIcon
} from 'lucide-react';

// Semester interface for the new design
interface Semester {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

// Comprehensive grade scale with multiple formats
const gradeScale = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0
};

// Grade reference table data
const gradeReference = [
  { grade: 'A+', points: '4.0', percentage: '97-100%' },
  { grade: 'A', points: '4.0', percentage: '93-96%' },
  { grade: 'A-', points: '3.7', percentage: '90-92%' },
  { grade: 'B+', points: '3.3', percentage: '87-89%' },
  { grade: 'B', points: '3.0', percentage: '83-86%' },
  { grade: 'B-', points: '2.7', percentage: '80-82%' },
  { grade: 'C+', points: '2.3', percentage: '77-79%' },
  { grade: 'C', points: '2.0', percentage: '73-76%' },
  { grade: 'C-', points: '1.7', percentage: '70-72%' },
  { grade: 'D+', points: '1.3', percentage: '67-69%' },
  { grade: 'D', points: '1.0', percentage: '65-66%' },
  { grade: 'D-', points: '0.7', percentage: '60-64%' },
  { grade: 'F', points: '0.0', percentage: '0-59%' }
];

function GPACalculator() {
  // Initialize with one semester containing 4 empty courses
  const [semesters, setSemesters] = useState<Semester[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [gpa, setGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);
  const [showGradeDistribution, setShowGradeDistribution] = useState(false);

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
      toast.success('🎉 Outstanding GPA! Keep up the excellent work!');
    }
  }, [semesters]);

  useEffect(() => {
    calculateGPA();
  }, [calculateGPA]);

  const addCourse = (semesterIndex: number) => {
    const newCourse: Semester = {
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

  const addSemester = () => {
    const newSemesterCourses: Semester[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterCourses]);
    toast.success('New semester added!');
  };

  const updateCourse = (semesterIndex: number, courseId: string, field: keyof Semester, value: any) => {
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

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gpa >= 2.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGPAGrade = (gpa: number) => {
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.3) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.7) return 'C-';
    if (gpa >= 1.3) return 'D+';
    if (gpa >= 1.0) return 'D';
    return 'F';
  };

  // Calculate grade distribution for pie chart
  const getGradeDistribution = () => {
    const validCourses = semesters.flat().filter(c => c.name && c.grade && c.credits > 0);
    const distribution: { [key: string]: number } = {
      'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
    };

    validCourses.forEach(course => {
      const grade = course.grade[0]; // Get first letter (A, B, C, D, F)
      if (distribution[grade] !== undefined) {
        distribution[grade]++;
      }
    });

    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([grade, count]) => ({ name: grade, value: count }));
  };

  const gradeDistribution = getGradeDistribution();
  const COLORS = {
    'A': '#10b981', // Green
    'B': '#3b82f6', // Blue
    'C': '#f59e0b', // Yellow
    'D': '#f97316', // Orange
    'F': '#ef4444'  // Red
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your GPA across all courses. Enter your course grades and credit hours to get instant results.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Input Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6" />
                  Course Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your course details below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Semester Boxes */}
                  {semesters.map((semesterCourses, semesterIndex) => (
                    <Card key={semesterIndex} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Semester {semesterIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Column Headers */}
                          <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                            <div>Course Name</div>
                            <div>Grade</div>
                            <div>Credit Hours</div>
                            <div>Action</div>
                          </div>

                          {/* Course Rows */}
                          <div className="space-y-3">
                            {semesterCourses.map((course, courseIndex) => (
                              <motion.div 
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-4 gap-3 items-center"
                              >
                                <Input
                                  placeholder={`Course ${courseIndex + 1}`}
                                  value={course.name}
                                  onChange={(e) => updateCourse(semesterIndex, course.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Select 
                                  value={course.grade} 
                                  onValueChange={(value) => updateCourse(semesterIndex, course.id, 'grade', value)}
                                >
                                  <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10">
                                    <SelectValue placeholder="Grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(gradeScale).map(([grade, points]) => (
                                      <SelectItem key={grade} value={grade}>
                                        {grade} ({points.toFixed(1)})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Input
                                  type="number"
                                  placeholder="Credits"
                                  min="0"
                                  max="30"
                                  step="0.5"
                                  value={course.credits || ''}
                                  onChange={(e) => updateCourse(semesterIndex, course.id, 'credits', parseFloat(e.target.value) || 0)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCourse(semesterIndex, course.id)}
                                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={semesterCourses.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Add Course Button */}
                          <Button 
                            onClick={() => addCourse(semesterIndex)}
                            variant="outline"
                            className="w-full h-10 border-2 border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      onClick={addSemester} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Semester
                    </Button>
                    <Button 
                      onClick={calculateGPA} 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate GPA
                    </Button>
                    <Button 
                      onClick={resetCalculator} 
                      variant="outline" 
                      className="flex-1 h-12 border-2"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grade Reference Table */}
            <Card className="mt-6 shadow-lg">
              <Collapsible open={isGradeTableOpen} onOpenChange={setIsGradeTableOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Grade Point Reference
                      </span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isGradeTableOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700 dark:text-gray-300">Grade</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Points</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Percentage</div>
                      {gradeReference.map((item) => (
                        <React.Fragment key={item.grade}>
                          <div className="font-medium">{item.grade}</div>
                          <div>{item.points}</div>
                          <div className="text-gray-600 dark:text-gray-400">{item.percentage}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Right Side - Results Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-2 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Your Results</CardTitle>
                <CardDescription className="text-green-100">
                  Calculated GPA Summary
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main GPA Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={gpa} maxValue={4.0} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ color: gpa >= 3.7 ? '#10b981' : gpa >= 3.0 ? '#3b82f6' : gpa >= 2.5 ? '#f59e0b' : '#ef4444' }}>
                          {gpa.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          GPA
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getGPAGrade(gpa)}
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Credits:</span>
                      <span className="text-sm font-bold">{totalCredits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Courses Counted:</span>
                      <span className="text-sm font-bold">
                        {semesters.flat().filter(c => c.name && c.grade && c.credits > 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quality Points:</span>
                      <span className="text-sm font-bold">
                        {(gpa * totalCredits).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Performance</div>
                    <div className={`text-lg font-bold ${getGPAColor(gpa)}`}>
                      {gpa >= 3.7 ? 'Excellent' : 
                       gpa >= 3.0 ? 'Good' : 
                       gpa >= 2.5 ? 'Satisfactory' : 
                       gpa >= 2.0 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>

                  {/* Grade Distribution Pie Chart */}
                  {gradeDistribution.length > 0 && (
                    <div className="border-t pt-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-3"
                        onClick={() => setShowGradeDistribution(!showGradeDistribution)}
                      >
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <PieChartIcon className="w-4 h-4" />
                          Grade Distribution
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showGradeDistribution ? 'rotate-180' : ''}`} />
                      </div>
                      {showGradeDistribution && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={gradeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {gradeDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Other Calculators</div>
                    <Link to="/calculators/college-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        College GPA Calculator
                      </Button>
                    </Link>
                    <Link to="/calculators/high-school-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        High School GPA Calculator
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  return <GPACalculator />;
}