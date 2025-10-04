import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { CircularMeter } from '../ui/circular-meter';
import { toast } from 'sonner@2.0.3';
import { 
  Calculator,
  Plus,
  Trash2,
  BookOpen,
  GraduationCap,
  Sparkles
} from 'lucide-react';

// Simplified Course interface
interface Course {
  id: string;
  name: string;
  grade: string;
  gradePoints: number;
  credits: number; // Only used if advanced mode is enabled
}

// Simple grade scale
const gradeScale = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0
};

function MiddleSchoolGPACalculator() {
  const [useCredits, setUseCredits] = useState(false); // Advanced mode toggle
  
  // Initialize with 6 empty courses (typical middle school schedule)
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: '', gradePoints: 0, credits: 1 },
    { id: '2', name: '', grade: '', gradePoints: 0, credits: 1 },
    { id: '3', name: '', grade: '', gradePoints: 0, credits: 1 },
    { id: '4', name: '', grade: '', gradePoints: 0, credits: 1 },
    { id: '5', name: '', grade: '', gradePoints: 0, credits: 1 },
    { id: '6', name: '', grade: '', gradePoints: 0, credits: 1 }
  ]);
  
  const [gpa, setGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  const calculateGPA = useCallback(() => {
    const validCourses = courses.filter(course => 
      course.name && course.grade
    );
    
    if (validCourses.length === 0) {
      setGPA(0);
      setTotalCredits(0);
      return;
    }

    if (useCredits) {
      // Calculate weighted GPA by credits
      const validCoursesWithCredits = validCourses.filter(c => c.credits > 0);
      if (validCoursesWithCredits.length === 0) {
        setGPA(0);
        setTotalCredits(0);
        return;
      }
      
      const totalPoints = validCoursesWithCredits.reduce(
        (sum, course) => sum + (course.gradePoints * course.credits), 0
      );
      const totalCreds = validCoursesWithCredits.reduce(
        (sum, course) => sum + course.credits, 0
      );
      
      const calculatedGPA = totalPoints / totalCreds;
      setGPA(parseFloat(calculatedGPA.toFixed(3)));
      setTotalCredits(totalCreds);
    } else {
      // Simple average GPA (no credits)
      const totalPoints = validCourses.reduce(
        (sum, course) => sum + course.gradePoints, 0
      );
      
      const calculatedGPA = totalPoints / validCourses.length;
      setGPA(parseFloat(calculatedGPA.toFixed(3)));
      setTotalCredits(validCourses.length);
    }

    // Celebration for high GPA
    if (gpa >= 3.8 && validCourses.length >= 4) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Amazing grades! Keep up the great work!');
    }
  }, [courses, useCredits, gpa]);

  useEffect(() => {
    calculateGPA();
  }, [calculateGPA]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      grade: '',
      gradePoints: 0,
      credits: 1
    };
    setCourses([...courses, newCourse]);
    toast.success('New course added!');
  };

  const updateCourse = (courseId: string, field: keyof Course, value: any) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const updatedCourse = { ...course, [field]: value };
        if (field === 'grade') {
          updatedCourse.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
        }
        return updatedCourse;
      }
      return course;
    }));
  };

  const removeCourse = (courseId: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== courseId));
      toast.success('Course removed');
    }
  };

  const resetCalculator = () => {
    setCourses([
      { id: '1', name: '', grade: '', gradePoints: 0, credits: 1 },
      { id: '2', name: '', grade: '', gradePoints: 0, credits: 1 },
      { id: '3', name: '', grade: '', gradePoints: 0, credits: 1 },
      { id: '4', name: '', grade: '', gradePoints: 0, credits: 1 },
      { id: '5', name: '', grade: '', gradePoints: 0, credits: 1 },
      { id: '6', name: '', grade: '', gradePoints: 0, credits: 1 }
    ]);
    setGPA(0);
    setTotalCredits(0);
    setUseCredits(false);
    toast.success('Calculator reset');
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600 dark:text-green-400';
    if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
    if (gpa >= 2.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceLabel = (gpa: number) => {
    if (gpa >= 3.7) return 'Excellent! 🌟';
    if (gpa >= 3.0) return 'Good Job! 👍';
    if (gpa >= 2.5) return 'Satisfactory ✓';
    if (gpa >= 2.0) return 'Needs Improvement 📚';
    return 'Keep Trying! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Middle School GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple GPA calculator designed for middle school students. Track your grades and see how you're doing! 🎓
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Input Form */}
          <div className="lg:col-span-2">
            {/* Advanced Mode Toggle */}
            <Card className="shadow-lg border-2 mb-6">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Calculation Mode
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Simple</span>
                    <Switch
                      checked={useCredits}
                      onCheckedChange={setUseCredits}
                      className="data-[state=checked]:bg-white"
                    />
                    <span className="text-sm">Advanced</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-teal-100">
                  {useCredits 
                    ? 'Advanced mode: Use credit hours for weighted calculation'
                    : 'Simple mode: Calculate average grade points (recommended)'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6" />
                  Your Courses
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your course names and grades
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Column Headers */}
                  <div className={`grid ${useCredits ? 'grid-cols-4' : 'grid-cols-3'} gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b`}>
                    <div>Course Name</div>
                    <div>Grade</div>
                    {useCredits && <div>Credits</div>}
                    <div>Action</div>
                  </div>

                  {/* Course Rows */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`grid ${useCredits ? 'grid-cols-4' : 'grid-cols-3'} gap-3 items-center`}
                      >
                        <Input
                          placeholder={`Course ${index + 1}`}
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                          className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                        />
                        
                        <Select 
                          value={course.grade} 
                          onValueChange={(value) => updateCourse(course.id, 'grade', value)}
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

                        {useCredits && (
                          <Input
                            type="number"
                            placeholder="Credits"
                            min="0"
                            max="5"
                            step="0.5"
                            value={course.credits || ''}
                            onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                          />
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCourse(course.id)}
                          className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={courses.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add Course Button */}
                  <Button 
                    onClick={addCourse}
                    variant="outline"
                    className="w-full h-10 border-2 border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
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

            {/* Parent-Friendly Info Card */}
            <Card className="mt-6 shadow-lg border-2 border-blue-200 dark:border-blue-700">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                  <Sparkles className="h-5 w-5" />
                  For Parents & Students
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• <strong>Simple Mode:</strong> Perfect for most middle schools - calculates average of all grades</li>
                  <li>• <strong>Advanced Mode:</strong> Use if your school assigns credit hours to courses</li>
                  <li>• <strong>GPA Scale:</strong> Based on 4.0 scale (A = 4.0, B = 3.0, C = 2.0, etc.)</li>
                  <li>• <strong>Tip:</strong> Track your grades each semester to see your progress!</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Results Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-2 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Your Results</CardTitle>
                <CardDescription className="text-green-100">
                  Your GPA Summary
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main GPA Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={gpa} maxValue={4.0} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ 
                          color: gpa >= 3.7 ? '#10b981' : gpa >= 3.0 ? '#3b82f6' : gpa >= 2.5 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {gpa.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Your GPA
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Out of 4.0
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {useCredits ? 'Total Credits:' : 'Courses:'}
                      </span>
                      <span className="text-sm font-bold">{totalCredits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Grades Counted:</span>
                      <span className="text-sm font-bold">
                        {courses.filter(c => c.name && c.grade).length}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator - Kid-Friendly */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Performance</div>
                    <div className={`text-xl font-bold ${getGPAColor(gpa)}`}>
                      {getPerformanceLabel(gpa)}
                    </div>
                  </div>

                  {/* Motivational Messages */}
                  {gpa > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {gpa >= 3.7 && "🌟 You're doing amazing! Keep it up!"}
                        {gpa >= 3.0 && gpa < 3.7 && "👍 Great work! You're on the right track!"}
                        {gpa >= 2.5 && gpa < 3.0 && "✓ Good job! A little more effort will help!"}
                        {gpa >= 2.0 && gpa < 2.5 && "📚 Keep studying! You can improve!"}
                        {gpa < 2.0 && "💪 Don't give up! Ask for help if you need it!"}
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Next Step</div>
                    <Link to="/calculators/high-school-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        High School GPA Calculator
                      </Button>
                    </Link>
                    <Link to="/calculators/college-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        College GPA Calculator
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

export { MiddleSchoolGPACalculator };