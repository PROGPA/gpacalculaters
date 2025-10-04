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
  ArrowRight,
  TrendingUp
} from 'lucide-react';

// SGPA Data interface
interface SGPAData {
  id: string;
  name: string;
  credits: number; // Credit hours for this semester
  grade: string; // This will store the SGPA as a string
  gradePoints: number; // This will be the SGPA as a number for calculations
}

// CGPA scale reference
const cgpaReference = [
  { grade: '9.5-10.0', points: 'Outstanding', percentage: 'First Class with Distinction' },
  { grade: '8.5-9.4', points: 'Excellent', percentage: 'First Class with Distinction' },
  { grade: '7.5-8.4', points: 'Very Good', percentage: 'First Class' },
  { grade: '6.5-7.4', points: 'Good', percentage: 'First Class' },
  { grade: '5.5-6.4', points: 'Above Average', percentage: 'Second Class' },
  { grade: '5.0-5.4', points: 'Average', percentage: 'Second Class' },
  { grade: '4.0-4.9', points: 'Below Average', percentage: 'Pass Class' },
  { grade: 'Below 4.0', points: 'Poor', percentage: 'Fail' }
];

function SGPAToCGPAConverter() {
  // Initialize with one semester containing 4 empty SGPA entries - exact match to homepage structure
  const [semesters, setSemesters] = useState<SGPAData[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [cgpa, setCGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);

  const calculateCGPA = useCallback(() => {
    const allSGPAData = semesters.flat();
    const validSGPAData = allSGPAData.filter(sgpaData => 
      sgpaData.name && sgpaData.grade && sgpaData.credits > 0
    );
    
    if (validSGPAData.length === 0) {
      setCGPA(0);
      setTotalCredits(0);
      return;
    }

    const totalPoints = validSGPAData.reduce(
      (sum, sgpaData) => sum + (sgpaData.gradePoints * sgpaData.credits), 0
    );
    const totalCreds = validSGPAData.reduce(
      (sum, sgpaData) => sum + sgpaData.credits, 0
    );
    
    const calculatedCGPA = totalPoints / totalCreds;
    setCGPA(parseFloat(calculatedCGPA.toFixed(3)));
    setTotalCredits(totalCreds);

    // Celebration for high CGPA
    if (calculatedCGPA >= 9.5 && validSGPAData.length >= 3) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Outstanding CGPA! Exceptional academic performance!');
    }
  }, [semesters]);

  useEffect(() => {
    calculateCGPA();
  }, [calculateCGPA]);

  const addCourse = (semesterIndex: number) => {
    const newSGPAData: SGPAData = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = [...updatedSemesters[semesterIndex], newSGPAData];
    setSemesters(updatedSemesters);
    toast.success('New semester added!');
  };

  const addSemester = () => {
    const newSemesterSGPAData: SGPAData[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterSGPAData]);
    toast.success('New semester group added!');
  };

  const updateCourse = (semesterIndex: number, sgpaId: string, field: keyof SGPAData, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].map(sgpaData => {
      if (sgpaData.id === sgpaId) {
        const updatedSGPAData = { ...sgpaData, [field]: value };
        if (field === 'grade') {
          // Convert SGPA string to number for calculations
          const sgpaValue = parseFloat(value) || 0;
          if (sgpaValue >= 0 && sgpaValue <= 10) {
            updatedSGPAData.gradePoints = sgpaValue;
          } else {
            updatedSGPAData.gradePoints = 0;
          }
        }
        return updatedSGPAData;
      }
      return sgpaData;
    });
    setSemesters(updatedSemesters);
  };

  const removeCourse = (semesterIndex: number, sgpaId: string) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].length > 1) {
      updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].filter(sgpaData => sgpaData.id !== sgpaId);
      setSemesters(updatedSemesters);
      toast.success('Semester removed');
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
    setCGPA(0);
    setTotalCredits(0);
    toast.success('Calculator reset');
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 8.5) return '#10b981'; // green
    if (gpa >= 7.0) return '#3b82f6'; // blue
    if (gpa >= 6.0) return '#f59e0b'; // yellow
    if (gpa >= 5.0) return '#ef4444'; // red
    return '#ef4444'; // red
  };

  const getGPAGrade = (gpa: number): string => {
    if (gpa >= 9.5) return 'Outstanding';
    if (gpa >= 8.5) return 'Excellent';
    if (gpa >= 7.5) return 'Very Good';
    if (gpa >= 6.5) return 'Good';
    if (gpa >= 5.5) return 'Above Average';
    if (gpa >= 5.0) return 'Average';
    if (gpa >= 4.0) return 'Below Average';
    return 'Poor';
  };

  const convert4PointScale = (gpa10: number) => {
    // Common conversion formula: (GPA_10 - 0.75) / 2.25
    return Math.max(0, Math.min(4.0, (gpa10 - 0.75) / 2.25));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Exact match to homepage */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SGPA to CGPA Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your semester GPA (SGPA) to cumulative GPA (CGPA) using the 10-point scale system.
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
                  SGPA Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your semester SGPA and credit details below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* SGPA Data Boxes */}
                  {semesters.map((semesterSGPAData, semesterIndex) => (
                    <Card key={semesterIndex} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Semester Group {semesterIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Column Headers */}
                          <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                            <div>Semester Name</div>
                            <div>SGPA (0-10)</div>
                            <div>Credit Hours</div>
                            <div>Action</div>
                          </div>

                          {/* SGPA Rows */}
                          <div className="space-y-3">
                            {semesterSGPAData.map((sgpaData, sgpaIndex) => (
                              <motion.div 
                                key={sgpaData.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-4 gap-3 items-center"
                              >
                                <Input
                                  placeholder={`Semester ${sgpaIndex + 1}`}
                                  value={sgpaData.name}
                                  onChange={(e) => updateCourse(semesterIndex, sgpaData.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Input
                                  type="number"
                                  placeholder="8.5"
                                  min="0"
                                  max="10"
                                  step="0.01"
                                  value={sgpaData.grade || ''}
                                  onChange={(e) => updateCourse(semesterIndex, sgpaData.id, 'grade', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Input
                                  type="number"
                                  placeholder="Credits"
                                  min="0"
                                  max="30"
                                  step="0.5"
                                  value={sgpaData.credits || ''}
                                  onChange={(e) => updateCourse(semesterIndex, sgpaData.id, 'credits', parseFloat(e.target.value) || 0)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCourse(semesterIndex, sgpaData.id)}
                                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={semesterSGPAData.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Add SGPA Button */}
                          <Button 
                            onClick={() => addCourse(semesterIndex)}
                            variant="outline"
                            className="w-full h-10 border-2 border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Semester
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
                      onClick={calculateCGPA} 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate CGPA
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

            {/* CGPA Reference Table */}
            <Card className="mt-6 shadow-lg">
              <Collapsible open={isGradeTableOpen} onOpenChange={setIsGradeTableOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        CGPA Scale Reference
                      </span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isGradeTableOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium text-gray-700 dark:text-gray-300">CGPA Range</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Grade</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Classification</div>
                      {cgpaReference.map((item, index) => (
                        <React.Fragment key={index}>
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
              <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">CGPA Results</CardTitle>
                <CardDescription className="text-violet-100">
                  Your calculated cumulative GPA
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Main CGPA Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={cgpa} maxValue={10.0} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ color: getGPAColor(cgpa) }}>
                          {cgpa.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          CGPA (10-Point)
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getGPAGrade(cgpa)}
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Scale Conversions */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                        {convert4PointScale(cgpa).toFixed(2)}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                        US GPA (4-Point Scale)
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Approximate conversion
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Credits:</span>
                      <span className="text-sm font-bold">{totalCredits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Semesters Counted:</span>
                      <span className="text-sm font-bold">
                        {semesters.flat().filter(s => s.name && s.grade && s.credits > 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quality Points:</span>
                      <span className="text-sm font-bold">
                        {(cgpa * totalCredits).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Classification</div>
                    <div className="font-bold" style={{ color: getGPAColor(cgpa) }}>
                      {cgpa >= 8.5 ? 'First Class with Distinction' : 
                       cgpa >= 6.5 ? 'First Class' : 
                       cgpa >= 5.0 ? 'Second Class' : 
                       cgpa >= 4.0 ? 'Pass Class' : 'Fail'}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Other Calculators</div>
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

export { SGPAToCGPAConverter };