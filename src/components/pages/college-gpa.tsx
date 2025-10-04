import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCMS } from '../cms/cms-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CircularMeter } from '../ui/circular-meter';
import { toast } from 'sonner@2.0.3';
import { 
  Calculator,
  Plus,
  Trash2,
  ChevronDown,
  Info,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Download
} from 'lucide-react';

// Course interface
interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

// Comprehensive grade scale
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

function CollegeGPACalculator() {
  const { data } = useCMS();
  const calculatorData = data.calculators['college-gpa'];
  
  // Previous GPA inputs
  const [previousGPA, setPreviousGPA] = useState<string>('');
  const [previousCredits, setPreviousCredits] = useState<string>('');
  
  // Initialize with one semester containing 4 empty courses
  const [semesters, setSemesters] = useState<Course[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [currentGPA, setCurrentGPA] = useState<number>(0);
  const [cumulativeGPA, setCumulativeGPA] = useState<number>(0);
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);

  const calculateGPA = useCallback(() => {
    const allCourses = semesters.flat();
    const validCourses = allCourses.filter(course => 
      course.name && course.grade && course.credits > 0
    );
    
    // Calculate current semester GPA
    if (validCourses.length === 0) {
      setCurrentGPA(0);
      setCurrentCredits(0);
      setCumulativeGPA(parseFloat(previousGPA) || 0);
      setTotalCredits(parseFloat(previousCredits) || 0);
      return;
    }

    const currentPoints = validCourses.reduce(
      (sum, course) => sum + (course.gradePoints * course.credits), 0
    );
    const currentCreds = validCourses.reduce(
      (sum, course) => sum + course.credits, 0
    );
    
    const calculatedCurrentGPA = currentPoints / currentCreds;
    setCurrentGPA(parseFloat(calculatedCurrentGPA.toFixed(3)));
    setCurrentCredits(currentCreds);

    // Calculate cumulative GPA if previous GPA is provided
    const prevGPA = parseFloat(previousGPA) || 0;
    const prevCreds = parseFloat(previousCredits) || 0;
    
    const totalQualityPoints = currentPoints + (prevGPA * prevCreds);
    const totalCreds = currentCreds + prevCreds;
    
    const calculatedCumulativeGPA = totalCreds > 0 ? totalQualityPoints / totalCreds : calculatedCurrentGPA;
    setCumulativeGPA(parseFloat(calculatedCumulativeGPA.toFixed(3)));
    setTotalCredits(totalCreds);

    // Celebration for high GPA
    if (calculatedCumulativeGPA >= 3.8 && validCourses.length >= 3) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Outstanding College GPA! Keep up the excellent work!');
    }
  }, [semesters, previousGPA, previousCredits]);

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

  const addSemester = () => {
    const newSemesterCourses: Course[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterCourses]);
    toast.success('New semester added!');
  };

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
    setPreviousGPA('');
    setPreviousCredits('');
    setCurrentGPA(0);
    setCumulativeGPA(0);
    setCurrentCredits(0);
    setTotalCredits(0);
    toast.success('Calculator reset');
  };

  const exportToPDF = () => {
    toast.info('PDF export feature coming soon!');
  };

  const exportToExcel = () => {
    toast.info('Excel export feature coming soon!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {calculatorData.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {calculatorData.description}
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Input Form */}
          <div className="lg:col-span-2">
            {/* Previous GPA Input Section */}
            <Card className="shadow-lg border-2 mb-6">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Info className="h-6 w-6" />
                  Previous Academic Record (Optional)
                </CardTitle>
                <CardDescription className="text-teal-100">
                  Include your previous GPA and credits for cumulative calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Previous GPA</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 3.5"
                      min="0"
                      max="4.0"
                      step="0.01"
                      value={previousGPA}
                      onChange={(e) => setPreviousGPA(e.target.value)}
                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10 mt-2"
                    />
                  </div>
                  <div>
                    <Label>Previous Credits</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 60"
                      min="0"
                      step="0.5"
                      value={previousCredits}
                      onChange={(e) => setPreviousCredits(e.target.value)}
                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10 mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                                  placeholder={calculatorData.placeholders.courseName || `Course ${courseIndex + 1}`}
                                  value={course.name}
                                  onChange={(e) => updateCourse(semesterIndex, course.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Select 
                                  value={course.grade} 
                                  onValueChange={(value) => updateCourse(semesterIndex, course.id, 'grade', value)}
                                >
                                  <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10">
                                    <SelectValue placeholder={calculatorData.placeholders.grade || "Grade"} />
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
                                  placeholder={calculatorData.placeholders.credits || "Credits"}
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
                      {calculatorData.buttonText}
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
                  College GPA Summary
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
                          {previousGPA ? 'Cumulative GPA' : 'Current GPA'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getGPAGrade(cumulativeGPA)}
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    {previousGPA && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Semester GPA:</span>
                          <span className="text-sm font-bold">{currentGPA.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Credits:</span>
                          <span className="text-sm font-bold">{currentCredits}</span>
                        </div>
                      </>
                    )}
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
                        {(cumulativeGPA * totalCredits).toFixed(2)}
                      </span>
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
                    <Link to="/calculators/high-school-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        High School GPA Calculator
                      </Button>
                    </Link>
                    <Link to="/calculators/semester-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <TrendingUp className="w-4 h-4 mr-2" />
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

export { CollegeGPACalculator };