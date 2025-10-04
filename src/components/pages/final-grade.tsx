import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
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
  Target
} from 'lucide-react';

// Assignment interface for final grade calculator
interface Assignment {
  id: string;
  name: string;
  credits: number; // This will be the weight/percentage for final grade calc
  grade: string;
  gradePoints: number; // This will be the actual percentage score
}

// Grade scale specific to final grade calculator (percentage-based)
const gradeScale = {
  'A+': 97, 'A': 93, 'A-': 90,
  'B+': 87, 'B': 83, 'B-': 80,
  'C+': 77, 'C': 73, 'C-': 70,
  'D+': 67, 'D': 65, 'D-': 60, 'F': 0
};

// Grade reference table data for final grade calculator
const gradeReference = [
  { grade: 'A+', points: '97-100%', percentage: '4.0 GPA' },
  { grade: 'A', points: '93-96%', percentage: '4.0 GPA' },
  { grade: 'A-', points: '90-92%', percentage: '3.7 GPA' },
  { grade: 'B+', points: '87-89%', percentage: '3.3 GPA' },
  { grade: 'B', points: '83-86%', percentage: '3.0 GPA' },
  { grade: 'B-', points: '80-82%', percentage: '2.7 GPA' },
  { grade: 'C+', points: '77-79%', percentage: '2.3 GPA' },
  { grade: 'C', points: '73-76%', percentage: '2.0 GPA' },
  { grade: 'C-', points: '70-72%', percentage: '1.7 GPA' },
  { grade: 'D+', points: '67-69%', percentage: '1.3 GPA' },
  { grade: 'D', points: '65-66%', percentage: '1.0 GPA' },
  { grade: 'D-', points: '60-64%', percentage: '0.7 GPA' },
  { grade: 'F', points: '0-59%', percentage: '0.0 GPA' }
];

function FinalGradeCalculator() {
  // Initialize with one semester containing 4 empty assignments - exact match to homepage structure
  const [semesters, setSemesters] = useState<Assignment[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  const [currentGrade, setCurrentGrade] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [targetGrade, setTargetGrade] = useState<number>(90);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(25);
  const [requiredScore, setRequiredScore] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);

  const calculateGrade = useCallback(() => {
    const allAssignments = semesters.flat();
    const validAssignments = allAssignments.filter(assignment => 
      assignment.name && assignment.grade && assignment.credits > 0
    );
    
    if (validAssignments.length === 0) {
      setCurrentGrade(0);
      setTotalCredits(0);
      setRequiredScore(0);
      return;
    }

    const totalPoints = validAssignments.reduce(
      (sum, assignment) => sum + (assignment.gradePoints * assignment.credits), 0
    );
    const totalCreds = validAssignments.reduce(
      (sum, assignment) => sum + assignment.credits, 0
    );
    
    const calculatedGrade = totalPoints / totalCreds;
    setCurrentGrade(parseFloat(calculatedGrade.toFixed(2)));
    setTotalCredits(totalCreds);

    // Calculate required score on final exam
    const currentWeightedGrade = calculatedGrade * (100 - finalExamWeight) / 100;
    const requiredFinalScore = (targetGrade - currentWeightedGrade) / (finalExamWeight / 100);
    setRequiredScore(Math.max(0, parseFloat(requiredFinalScore.toFixed(1))));

    // Celebration for achievable target
    if (requiredFinalScore <= 100 && requiredFinalScore >= 0 && validAssignments.length >= 2) {
      if (requiredFinalScore <= 0) {
        toast.success('🎉 You\'ve already achieved your target grade!');
      } else if (requiredFinalScore <= 70) {
        toast.success('✅ Your target grade is very achievable!');
      }
    } else if (requiredFinalScore > 100) {
      toast.error('⚠️ Your target grade may not be achievable with current scores');
    }
  }, [semesters, targetGrade, finalExamWeight]);

  useEffect(() => {
    calculateGrade();
  }, [calculateGrade]);

  const addCourse = (semesterIndex: number) => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = [...updatedSemesters[semesterIndex], newAssignment];
    setSemesters(updatedSemesters);
    toast.success('New assignment added!');
  };

  const addSemester = () => {
    const newSemesterAssignments: Assignment[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterAssignments]);
    toast.success('New assignment group added!');
  };

  const updateCourse = (semesterIndex: number, assignmentId: string, field: keyof Assignment, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].map(assignment => {
      if (assignment.id === assignmentId) {
        const updatedAssignment = { ...assignment, [field]: value };
        if (field === 'grade') {
          updatedAssignment.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
        }
        return updatedAssignment;
      }
      return assignment;
    });
    setSemesters(updatedSemesters);
  };

  const removeCourse = (semesterIndex: number, assignmentId: string) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].length > 1) {
      updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].filter(assignment => assignment.id !== assignmentId);
      setSemesters(updatedSemesters);
      toast.success('Assignment removed');
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
    setCurrentGrade(0);
    setTotalCredits(0);
    setTargetGrade(90);
    setFinalExamWeight(25);
    setRequiredScore(0);
    toast.success('Calculator reset');
  };

  const getScoreColor = (score: number) => {
    if (score <= 0) return '#10b981'; // green
    if (score <= 70) return '#10b981'; // green
    if (score <= 85) return '#f59e0b'; // yellow
    if (score <= 100) return '#ef4444'; // red
    return '#ef4444'; // red
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Exact match to homepage */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Final Grade Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate what score you need on your final exam to achieve your target grade. Enter your current assignments and their weights.
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
                  Assignment Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your current assignments and grades below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Target Grade and Final Exam Weight Settings */}
                  <Card className="border-2 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        Final Grade Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Target Grade (%)
                          </label>
                          <Input
                            type="number"
                            placeholder="90"
                            min="0"
                            max="100"
                            value={targetGrade || ''}
                            onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 h-10"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Final Exam Weight (%)
                          </label>
                          <Input
                            type="number"
                            placeholder="25"
                            min="0"
                            max="100"
                            value={finalExamWeight || ''}
                            onChange={(e) => setFinalExamWeight(parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 h-10"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assignment Boxes */}
                  {semesters.map((semesterAssignments, semesterIndex) => (
                    <Card key={semesterIndex} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Assignment Group {semesterIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Column Headers */}
                          <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                            <div>Assignment Name</div>
                            <div>Grade</div>
                            <div>Weight (%)</div>
                            <div>Action</div>
                          </div>

                          {/* Assignment Rows */}
                          <div className="space-y-3">
                            {semesterAssignments.map((assignment, assignmentIndex) => (
                              <motion.div 
                                key={assignment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-4 gap-3 items-center"
                              >
                                <Input
                                  placeholder={`Assignment ${assignmentIndex + 1}`}
                                  value={assignment.name}
                                  onChange={(e) => updateCourse(semesterIndex, assignment.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Select 
                                  value={assignment.grade} 
                                  onValueChange={(value) => updateCourse(semesterIndex, assignment.id, 'grade', value)}
                                >
                                  <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10">
                                    <SelectValue placeholder="Grade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(gradeScale).map(([grade, points]) => (
                                      <SelectItem key={grade} value={grade}>
                                        {grade} ({points}%)
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Input
                                  type="number"
                                  placeholder="Weight"
                                  min="0"
                                  max="100"
                                  step="0.5"
                                  value={assignment.credits || ''}
                                  onChange={(e) => updateCourse(semesterIndex, assignment.id, 'credits', parseFloat(e.target.value) || 0)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCourse(semesterIndex, assignment.id)}
                                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={semesterAssignments.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Add Assignment Button */}
                          <Button 
                            onClick={() => addCourse(semesterIndex)}
                            variant="outline"
                            className="w-full h-10 border-2 border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Assignment
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
                      onClick={calculateGrade} 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Final Grade
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
                        Grade Percentage Reference
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
                      <div className="font-medium text-gray-700 dark:text-gray-300">GPA Equivalent</div>
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
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Final Grade Results</CardTitle>
                <CardDescription className="text-orange-100">
                  Your current grade and required final exam score
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Current Grade Display */}
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                      {currentGrade.toFixed(1)}%
                    </div>
                    <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Current Grade
                    </div>
                  </div>

                  {/* Required Final Score Display with Circular Meter */}
                  <div className="text-center border-t pt-4">
                    <CircularMeter value={Math.min(requiredScore, 100)} maxValue={100} size={160} strokeWidth={12}>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-1" style={{ color: getScoreColor(requiredScore) }}>
                          {requiredScore <= 0 ? '0' : requiredScore > 100 ? '100+' : requiredScore.toFixed(0)}%
                        </div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Required Final
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Target: {targetGrade}%
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Target Grade:</span>
                      <span className="text-sm font-bold">{targetGrade}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Final Exam Weight:</span>
                      <span className="text-sm font-bold">{finalExamWeight}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Assignments Counted:</span>
                      <span className="text-sm font-bold">
                        {semesters.flat().filter(a => a.name && a.grade && a.credits > 0).length}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Assessment</div>
                    <div className="text-lg font-bold" style={{ color: getScoreColor(requiredScore) }}>
                      {requiredScore <= 0 ? 'Target Already Achieved!' : 
                       requiredScore <= 70 ? 'Very Achievable' : 
                       requiredScore <= 85 ? 'Challenging' : 
                       requiredScore <= 100 ? 'Very Difficult' : 'May Not Be Achievable'}
                    </div>
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

export { FinalGradeCalculator };