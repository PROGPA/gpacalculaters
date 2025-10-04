import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
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
  Award,
  CheckCircle,
  Target,
  AlertTriangle,
  XCircle
} from 'lucide-react';

// Test interface for EZ Grader
interface Test {
  id: string;
  name: string;
  credits: number; // This will be the total questions
  grade: string; // This will store the missed questions
  gradePoints: number; // This will be the calculated percentage
}

// Grade reference table data for EZ Grader
const gradeReference = [
  { grade: 'A+', points: '97-100%', percentage: 'Excellent' },
  { grade: 'A', points: '93-96%', percentage: 'Excellent' },
  { grade: 'A-', points: '90-92%', percentage: 'Excellent' },
  { grade: 'B+', points: '87-89%', percentage: 'Good' },
  { grade: 'B', points: '83-86%', percentage: 'Good' },
  { grade: 'B-', points: '80-82%', percentage: 'Good' },
  { grade: 'C+', points: '77-79%', percentage: 'Fair' },
  { grade: 'C', points: '73-76%', percentage: 'Fair' },
  { grade: 'C-', points: '70-72%', percentage: 'Fair' },
  { grade: 'D+', points: '67-69%', percentage: 'Poor' },
  { grade: 'D', points: '65-66%', percentage: 'Poor' },
  { grade: 'D-', points: '60-64%', percentage: 'Poor' },
  { grade: 'F', points: '0-59%', percentage: 'Failing' }
];

function EZGrader() {
  // Initialize with one semester containing 4 empty tests - exact match to homepage structure
  const [semesters, setSemesters] = useState<Test[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [averageGrade, setAverageGrade] = useState<number>(0);
  const [totalTests, setTotalTests] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);

  const calculateGrades = useCallback(() => {
    const allTests = semesters.flat();
    const validTests = allTests.filter(test => 
      test.name && test.credits > 0 && test.grade !== ''
    );
    
    if (validTests.length === 0) {
      setAverageGrade(0);
      setTotalTests(0);
      return;
    }

    // Calculate average percentage across all tests
    const totalPercentage = validTests.reduce((sum, test) => sum + test.gradePoints, 0);
    const avgGrade = totalPercentage / validTests.length;
    
    setAverageGrade(parseFloat(avgGrade.toFixed(2)));
    setTotalTests(validTests.length);

    // Celebration for high grades
    if (avgGrade >= 90 && validTests.length >= 2) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Excellent average! Keep up the great work!');
    }
  }, [semesters]);

  useEffect(() => {
    calculateGrades();
  }, [calculateGrades]);

  const addCourse = (semesterIndex: number) => {
    const newTest: Test = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = [...updatedSemesters[semesterIndex], newTest];
    setSemesters(updatedSemesters);
    toast.success('New test added!');
  };

  const addSemester = () => {
    const newSemesterTests: Test[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterTests]);
    toast.success('New test group added!');
  };

  const updateCourse = (semesterIndex: number, testId: string, field: keyof Test, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].map(test => {
      if (test.id === testId) {
        const updatedTest = { ...test, [field]: value };
        
        // Calculate percentage when total questions or missed questions change
        if (field === 'credits' || field === 'grade') {
          const totalQuestions = field === 'credits' ? parseFloat(value) || 0 : test.credits;
          const missedQuestions = field === 'grade' ? parseFloat(value) || 0 : parseFloat(test.grade) || 0;
          
          if (totalQuestions > 0 && missedQuestions >= 0 && missedQuestions <= totalQuestions) {
            const correctQuestions = totalQuestions - missedQuestions;
            const percentage = (correctQuestions / totalQuestions) * 100;
            updatedTest.gradePoints = parseFloat(percentage.toFixed(2));
          } else {
            updatedTest.gradePoints = 0;
          }
        }
        
        return updatedTest;
      }
      return test;
    });
    setSemesters(updatedSemesters);
  };

  const removeCourse = (semesterIndex: number, testId: string) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].length > 1) {
      updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].filter(test => test.id !== testId);
      setSemesters(updatedSemesters);
      toast.success('Test removed');
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
    setAverageGrade(0);
    setTotalTests(0);
    toast.success('Calculator reset');
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (percentage >= 70) return <Target className="w-8 h-8 text-blue-600" />;
    if (percentage >= 60) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Exact match to homepage */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            EZ Grader Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Quickly calculate grades for tests, quizzes, and assignments. Enter total questions and questions missed to get instant grades.
          </p>
        </div>

        {/* Main Calculator Grid - Exact match to homepage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Input Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6" />
                  Test Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your test details below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Test Boxes */}
                  {semesters.map((semesterTests, semesterIndex) => (
                    <Card key={semesterIndex} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Test Group {semesterIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Column Headers */}
                          <div className="grid grid-cols-5 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                            <div>Test Name</div>
                            <div>Total Questions</div>
                            <div>Questions Missed</div>
                            <div>Grade (%)</div>
                            <div>Action</div>
                          </div>

                          {/* Test Rows */}
                          <div className="space-y-3">
                            {semesterTests.map((test, testIndex) => (
                              <motion.div 
                                key={test.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-5 gap-3 items-center"
                              >
                                <Input
                                  placeholder={`Test ${testIndex + 1}`}
                                  value={test.name}
                                  onChange={(e) => updateCourse(semesterIndex, test.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Input
                                  type="number"
                                  placeholder="Total"
                                  min="1"
                                  max="1000"
                                  value={test.credits || ''}
                                  onChange={(e) => updateCourse(semesterIndex, test.id, 'credits', parseFloat(e.target.value) || 0)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Input
                                  type="number"
                                  placeholder="Missed"
                                  min="0"
                                  max={test.credits || 1000}
                                  value={test.grade || ''}
                                  onChange={(e) => updateCourse(semesterIndex, test.id, 'grade', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <div className="text-center">
                                  <div className={`text-lg font-bold ${
                                    test.gradePoints >= 90 ? 'text-green-600 dark:text-green-400' :
                                    test.gradePoints >= 80 ? 'text-blue-600 dark:text-blue-400' :
                                    test.gradePoints >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {test.gradePoints > 0 ? `${test.gradePoints.toFixed(1)}%` : '-'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {test.gradePoints > 0 ? getLetterGrade(test.gradePoints) : ''}
                                  </div>
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCourse(semesterIndex, test.id)}
                                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={semesterTests.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Add Test Button */}
                          <Button 
                            onClick={() => addCourse(semesterIndex)}
                            variant="outline"
                            className="w-full h-10 border-2 border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Test
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Action Buttons - Exact match to homepage */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      onClick={addSemester} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Group
                    </Button>
                    <Button 
                      onClick={calculateGrades} 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Grades
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
                        Grade Scale Reference
                      </span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isGradeTableOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700 dark:text-gray-300">Grade</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Percentage</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Quality</div>
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
                <CardTitle className="text-xl">Grade Results</CardTitle>
                <CardDescription className="text-green-100">
                  Average test performance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main Grade Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={averageGrade} maxValue={100} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ 
                          color: averageGrade >= 90 ? '#10b981' : averageGrade >= 80 ? '#3b82f6' : averageGrade >= 70 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {averageGrade.toFixed(1)}%
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Average Grade
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getLetterGrade(averageGrade)}
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tests Graded:</span>
                      <span className="text-sm font-bold">{totalTests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Highest Grade:</span>
                      <span className="text-sm font-bold">
                        {totalTests > 0 ? `${Math.max(...semesters.flat().filter(t => t.gradePoints > 0).map(t => t.gradePoints)).toFixed(1)}%` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Lowest Grade:</span>
                      <span className="text-sm font-bold">
                        {totalTests > 0 ? `${Math.min(...semesters.flat().filter(t => t.gradePoints > 0).map(t => t.gradePoints)).toFixed(1)}%` : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Performance</div>
                    <div className={`text-lg font-bold ${
                      averageGrade >= 90 ? 'text-green-600 dark:text-green-400' :
                      averageGrade >= 80 ? 'text-blue-600 dark:text-blue-400' :
                      averageGrade >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {averageGrade >= 90 ? 'Excellent' : 
                       averageGrade >= 80 ? 'Good' : 
                       averageGrade >= 70 ? 'Fair' : 
                       averageGrade >= 60 ? 'Poor' : 'Failing'}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Other Calculators</div>
                    <Link to="/calculators/final-grade">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Award className="w-4 h-4 mr-2" />
                        Final Grade Calculator
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

export { EZGrader };