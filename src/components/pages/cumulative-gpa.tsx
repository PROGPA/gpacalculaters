import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { CircularMeter } from '../ui/circular-meter';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calculator,
  Plus,
  Trash2,
  Info,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Download,
  Target
} from 'lucide-react';

// Course interface
interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

// Semester interface with courses
interface SemesterData {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
  credits: number;
}

// Comprehensive grade scale
const gradeScale = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0
};

function CumulativeGPACalculator() {
  // Initialize with 2 semesters, each with 4 courses
  const [semesters, setSemesters] = useState<SemesterData[]>([
    {
      id: '1',
      name: 'Semester 1',
      gpa: 0,
      credits: 0,
      courses: [
        { id: '1-1', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '1-2', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '1-3', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '1-4', name: '', credits: 0, grade: '', gradePoints: 0 }
      ]
    },
    {
      id: '2',
      name: 'Semester 2',
      gpa: 0,
      credits: 0,
      courses: [
        { id: '2-1', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '2-2', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '2-3', name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: '2-4', name: '', credits: 0, grade: '', gradePoints: 0 }
      ]
    }
  ]);
  
  const [cumulativeGPA, setCumulativeGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [targetGPA, setTargetGPA] = useState<string>('');
  const [showTargetTool, setShowTargetTool] = useState(false);

  const calculateSemesterGPA = (courses: Course[]) => {
    const validCourses = courses.filter(c => c.name && c.grade && c.credits > 0);
    if (validCourses.length === 0) return { gpa: 0, credits: 0 };
    
    const totalPoints = validCourses.reduce((sum, c) => sum + (c.gradePoints * c.credits), 0);
    const totalCreds = validCourses.reduce((sum, c) => sum + c.credits, 0);
    
    return {
      gpa: totalCreds > 0 ? totalPoints / totalCreds : 0,
      credits: totalCreds
    };
  };

  const calculateGPA = useCallback(() => {
    // Calculate GPA for each semester first
    const updatedSemesters = semesters.map(semester => {
      const result = calculateSemesterGPA(semester.courses);
      return {
        ...semester,
        gpa: result.gpa,
        credits: result.credits
      };
    });
    setSemesters(updatedSemesters);

    // Calculate cumulative GPA
    const validSemesters = updatedSemesters.filter(s => s.credits > 0);
    if (validSemesters.length === 0) {
      setCumulativeGPA(0);
      setTotalCredits(0);
      return;
    }

    const totalPoints = validSemesters.reduce((sum, s) => sum + (s.gpa * s.credits), 0);
    const totalCreds = validSemesters.reduce((sum, s) => sum + s.credits, 0);
    
    const calculatedGPA = totalPoints / totalCreds;
    setCumulativeGPA(parseFloat(calculatedGPA.toFixed(3)));
    setTotalCredits(totalCreds);

    // Performance insight messages
    if (validSemesters.length >= 2) {
      const lastSemester = validSemesters[validSemesters.length - 1];
      const previousSemester = validSemesters[validSemesters.length - 2];
      
      if (lastSemester.gpa > previousSemester.gpa) {
        toast.success(`📈 Your GPA improved from ${previousSemester.gpa.toFixed(2)} to ${lastSemester.gpa.toFixed(2)}!`);
      } else if (lastSemester.gpa < previousSemester.gpa) {
        toast.info(`📉 Your GPA dropped from ${previousSemester.gpa.toFixed(2)} to ${lastSemester.gpa.toFixed(2)}`);
      }
    }

    // Celebration for high GPA
    if (calculatedGPA >= 3.8 && validSemesters.length >= 2) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Outstanding Cumulative GPA! Keep up the excellent work!');
    }
  }, [semesters]);

  useEffect(() => {
    calculateGPA();
  }, [calculateGPA]);

  const addSemester = () => {
    const newSemester: SemesterData = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      gpa: 0,
      credits: 0,
      courses: [
        { id: `${Date.now()}-1`, name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: `${Date.now()}-2`, name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: `${Date.now()}-3`, name: '', credits: 0, grade: '', gradePoints: 0 },
        { id: `${Date.now()}-4`, name: '', credits: 0, grade: '', gradePoints: 0 }
      ]
    };
    setSemesters([...semesters, newSemester]);
    toast.success('New semester added!');
  };

  const addCourseToSemester = (semesterId: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        const newCourse: Course = {
          id: `${semesterId}-${Date.now()}`,
          name: '',
          credits: 0,
          grade: '',
          gradePoints: 0
        };
        return {
          ...semester,
          courses: [...semester.courses, newCourse]
        };
      }
      return semester;
    }));
    toast.success('Course added!');
  };

  const updateCourse = (semesterId: string, courseId: string, field: keyof Course, value: any) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          courses: semester.courses.map(course => {
            if (course.id === courseId) {
              const updatedCourse = { ...course, [field]: value };
              if (field === 'grade') {
                updatedCourse.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
              }
              return updatedCourse;
            }
            return course;
          })
        };
      }
      return semester;
    }));
  };

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId && semester.courses.length > 1) {
        return {
          ...semester,
          courses: semester.courses.filter(c => c.id !== courseId)
        };
      }
      return semester;
    }));
    toast.success('Course removed');
  };

  const removeSemester = (semesterId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== semesterId));
      toast.success('Semester removed');
    }
  };

  const resetCalculator = () => {
    setSemesters([
      {
        id: '1',
        name: 'Semester 1',
        gpa: 0,
        credits: 0,
        courses: [
          { id: '1-1', name: '', credits: 0, grade: '', gradePoints: 0 },
          { id: '1-2', name: '', credits: 0, grade: '', gradePoints: 0 },
          { id: '1-3', name: '', credits: 0, grade: '', gradePoints: 0 },
          { id: '1-4', name: '', credits: 0, grade: '', gradePoints: 0 }
        ]
      }
    ]);
    setCumulativeGPA(0);
    setTotalCredits(0);
    setTargetGPA('');
    toast.success('Calculator reset');
  };

  const exportToPDF = () => {
    toast.info('PDF export feature coming soon!');
  };

  const exportToExcel = () => {
    toast.info('Excel export feature coming soon!');
  };

  const calculateTargetGPA = () => {
    const target = parseFloat(targetGPA);
    if (isNaN(target) || target < 0 || target > 4.0) {
      toast.error('Please enter a valid target GPA (0-4.0)');
      return;
    }
    
    const neededPoints = (target * (totalCredits + 15)) - (cumulativeGPA * totalCredits);
    const neededGPA = neededPoints / 15;
    
    if (neededGPA > 4.0) {
      toast.error(`Target GPA of ${target} is not achievable. You need a ${neededGPA.toFixed(2)} next semester (max is 4.0)`);
    } else if (neededGPA < 0) {
      toast.success(`You've already exceeded your target GPA!`);
    } else {
      toast.success(`To reach ${target}, you need a ${neededGPA.toFixed(2)} GPA next semester (assuming 15 credits)`);
    }
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

  // Get best and worst semesters
  const validSemesters = semesters.filter(s => s.credits > 0);
  const bestSemester = validSemesters.length > 0 
    ? validSemesters.reduce((best, current) => current.gpa > best.gpa ? current : best)
    : null;
  const worstSemester = validSemesters.length > 0
    ? validSemesters.reduce((worst, current) => current.gpa < worst.gpa ? current : worst)
    : null;

  // Prepare chart data
  const chartData = validSemesters.map((sem, index) => ({
    name: sem.name,
    gpa: parseFloat(sem.gpa.toFixed(2))
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cumulative GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your academic progress across multiple semesters. Calculate cumulative GPA, view trends, and plan your target GPA.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6" />
                  Semester Courses
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter courses for each semester
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Accordion for Semesters */}
                  <Accordion type="multiple" defaultValue={['1', '2']} className="space-y-4">
                    {semesters.map((semester, semesterIndex) => (
                      <AccordionItem 
                        key={semester.id} 
                        value={semester.id}
                        className="border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">{semester.name}</span>
                            <div className="flex items-center gap-4">
                              {semester.credits > 0 && (
                                <>
                                  <span className={`text-sm ${getGPAColor(semester.gpa)}`}>
                                    GPA: {semester.gpa.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {semester.credits} credits
                                  </span>
                                  {semester.id === bestSemester?.id && (
                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                      Best
                                    </span>
                                  )}
                                  {semester.id === worstSemester?.id && validSemesters.length > 1 && (
                                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                      Worst
                                    </span>
                                  )}
                                </>
                              )}
                              {semesters.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSemester(semester.id);
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4 pt-2">
                            {/* Column Headers */}
                            <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                              <div>Course Name</div>
                              <div>Grade</div>
                              <div>Credit Hours</div>
                              <div>Action</div>
                            </div>

                            {/* Course Rows */}
                            <div className="space-y-3">
                              {semester.courses.map((course, courseIndex) => (
                                <motion.div
                                  key={course.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="grid grid-cols-4 gap-3 items-center"
                                >
                                  <Input
                                    placeholder={`Course ${courseIndex + 1}`}
                                    value={course.name}
                                    onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                                    className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                  />
                                  
                                  <Select 
                                    value={course.grade} 
                                    onValueChange={(value) => updateCourse(semester.id, course.id, 'grade', value)}
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
                                    onChange={(e) => updateCourse(semester.id, course.id, 'credits', parseFloat(e.target.value) || 0)}
                                    className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                  />
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeCourse(semester.id, course.id)}
                                    className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    disabled={semester.courses.length === 1}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              ))}
                            </div>

                            {/* Add Course Button */}
                            <Button 
                              onClick={() => addCourseToSemester(semester.id)}
                              variant="outline"
                              className="w-full h-10 border-2 border-dashed"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Course
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

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

            {/* GPA Trend Chart */}
            {chartData.length > 0 && (
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    GPA Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 4.0]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Target GPA Tool */}
            <Card className="shadow-lg border-2">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowTargetTool(!showTargetTool)}
              >
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Target GPA Calculator
                </CardTitle>
              </CardHeader>
              {showTargetTool && (
                <CardContent>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter target GPA (e.g., 3.5)"
                      min="0"
                      max="4.0"
                      step="0.1"
                      value={targetGPA}
                      onChange={(e) => setTargetGPA(e.target.value)}
                      className="border-2 border-gray-300 dark:border-gray-600"
                    />
                    <Button onClick={calculateTargetGPA} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Calculate
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right Side - Results Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-2 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Your Results</CardTitle>
                <CardDescription className="text-green-100">
                  Cumulative GPA Summary
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main GPA Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={cumulativeGPA} maxValue={4.0} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ 
                          color: cumulativeGPA >= 3.7 ? '#10b981' : cumulativeGPA >= 3.0 ? '#3b82f6' : cumulativeGPA >= 2.5 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {cumulativeGPA.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Cumulative GPA
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getGPAGrade(cumulativeGPA)}
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
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Semesters:</span>
                      <span className="text-sm font-bold">{validSemesters.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quality Points:</span>
                      <span className="text-sm font-bold">{(cumulativeGPA * totalCredits).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Performance</div>
                    <div className={`text-lg font-bold ${getGPAColor(cumulativeGPA)}`}>
                      {cumulativeGPA >= 3.7 ? 'Excellent' : 
                       cumulativeGPA >= 3.0 ? 'Good' : 
                       cumulativeGPA >= 2.5 ? 'Satisfactory' : 
                       cumulativeGPA >= 2.0 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Export Options</div>
                    <Button 
                      onClick={exportToPDF} 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as PDF
                    </Button>
                    <Button 
                      onClick={exportToExcel} 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as Excel
                    </Button>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Other Calculators</div>
                    <Link to="/calculators/college-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        College GPA Calculator
                      </Button>
                    </Link>
                    <Link to="/calculators/semester-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Semester GPA Calculator
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

export function CumulativeGPA() {
  return <CumulativeGPACalculator />;
}