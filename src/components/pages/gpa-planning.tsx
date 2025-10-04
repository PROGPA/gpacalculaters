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
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Planning scenario interface
interface PlanningScenario {
  id: string;
  name: string;
  credits: number; // Planned credits for this scenario
  grade: string; // Target grade for this scenario
  gradePoints: number; // GPA points for this scenario
}

// Grade scale for planning
const gradeScale = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0
};

// Grade reference table data
const gradeReference = [
  { grade: 'A+', points: '4.0', percentage: 'Outstanding' },
  { grade: 'A', points: '4.0', percentage: 'Excellent' },
  { grade: 'A-', points: '3.7', percentage: 'Excellent' },
  { grade: 'B+', points: '3.3', percentage: 'Good' },
  { grade: 'B', points: '3.0', percentage: 'Good' },
  { grade: 'B-', points: '2.7', percentage: 'Good' },
  { grade: 'C+', points: '2.3', percentage: 'Fair' },
  { grade: 'C', points: '2.0', percentage: 'Fair' },
  { grade: 'C-', points: '1.7', percentage: 'Fair' },
  { grade: 'D+', points: '1.3', percentage: 'Poor' },
  { grade: 'D', points: '1.0', percentage: 'Poor' },
  { grade: 'D-', points: '0.7', percentage: 'Poor' },
  { grade: 'F', points: '0.0', percentage: 'Failing' }
];

function GPAPlanningTool() {
  // Initialize with one semester containing 4 empty scenarios - exact match to homepage structure
  const [semesters, setSemesters] = useState<PlanningScenario[][]>([
    [
      { id: '1', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '2', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '3', name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: '4', name: '', credits: 0, grade: '', gradePoints: 0 }
    ]
  ]);
  
  // Current academic status
  const [currentGPA, setCurrentGPA] = useState<number>(0);
  const [currentCredits, setCurrentCredits] = useState<number>(0);
  const [targetGPA, setTargetGPA] = useState<number>(3.5);
  
  // Calculated results
  const [projectedGPA, setProjectedGPA] = useState<number>(0);
  const [totalPlannedCredits, setTotalPlannedCredits] = useState<number>(0);
  const [isAchievable, setIsAchievable] = useState<boolean>(true);
  const [requiredGPA, setRequiredGPA] = useState<number>(0);
  const [isGradeTableOpen, setIsGradeTableOpen] = useState(false);

  const calculateProjections = useCallback(() => {
    const allScenarios = semesters.flat();
    const validScenarios = allScenarios.filter(scenario => 
      scenario.name && scenario.grade && scenario.credits > 0
    );
    
    const plannedCredits = validScenarios.reduce((sum, scenario) => sum + scenario.credits, 0);
    setTotalPlannedCredits(plannedCredits);

    if (currentGPA === 0 && currentCredits === 0 && validScenarios.length === 0) {
      setProjectedGPA(0);
      setIsAchievable(true);
      setRequiredGPA(0);
      return;
    }

    // Calculate projected GPA
    const currentQualityPoints = currentGPA * currentCredits;
    const plannedQualityPoints = validScenarios.reduce(
      (sum, scenario) => sum + (scenario.gradePoints * scenario.credits), 0
    );
    const totalCredits = currentCredits + plannedCredits;
    
    if (totalCredits > 0) {
      const newProjectedGPA = (currentQualityPoints + plannedQualityPoints) / totalCredits;
      setProjectedGPA(parseFloat(newProjectedGPA.toFixed(3)));
    }

    // Calculate required GPA to reach target
    if (plannedCredits > 0 && targetGPA > 0) {
      const requiredTotalPoints = targetGPA * (currentCredits + plannedCredits);
      const requiredPlannedPoints = requiredTotalPoints - currentQualityPoints;
      const calculatedRequiredGPA = requiredPlannedPoints / plannedCredits;
      
      setRequiredGPA(Math.max(0, parseFloat(calculatedRequiredGPA.toFixed(3))));
      setIsAchievable(calculatedRequiredGPA <= 4.0 && calculatedRequiredGPA >= 0);
    }

    // Celebration for good planning
    if (validScenarios.length >= 3 && projectedGPA >= targetGPA) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
      toast.success('🎉 Great planning! Your projected GPA meets your target!');
    }
  }, [semesters, currentGPA, currentCredits, targetGPA, projectedGPA]);

  useEffect(() => {
    calculateProjections();
  }, [calculateProjections]);

  const addCourse = (semesterIndex: number) => {
    const newScenario: PlanningScenario = {
      id: Date.now().toString(),
      name: '',
      credits: 0,
      grade: '',
      gradePoints: 0
    };
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = [...updatedSemesters[semesterIndex], newScenario];
    setSemesters(updatedSemesters);
    toast.success('New scenario added!');
  };

  const addSemester = () => {
    const newSemesterScenarios: PlanningScenario[] = [
      { id: Date.now().toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 1).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 2).toString(), name: '', credits: 0, grade: '', gradePoints: 0 },
      { id: (Date.now() + 3).toString(), name: '', credits: 0, grade: '', gradePoints: 0 }
    ];
    setSemesters([...semesters, newSemesterScenarios]);
    toast.success('New planning group added!');
  };

  const updateCourse = (semesterIndex: number, scenarioId: string, field: keyof PlanningScenario, value: any) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].map(scenario => {
      if (scenario.id === scenarioId) {
        const updatedScenario = { ...scenario, [field]: value };
        if (field === 'grade') {
          updatedScenario.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
        }
        return updatedScenario;
      }
      return scenario;
    });
    setSemesters(updatedSemesters);
  };

  const removeCourse = (semesterIndex: number, scenarioId: string) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].length > 1) {
      updatedSemesters[semesterIndex] = updatedSemesters[semesterIndex].filter(scenario => scenario.id !== scenarioId);
      setSemesters(updatedSemesters);
      toast.success('Scenario removed');
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
    setCurrentGPA(0);
    setCurrentCredits(0);
    setTargetGPA(3.5);
    setProjectedGPA(0);
    setTotalPlannedCredits(0);
    toast.success('Planning tool reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Exact match to homepage */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GPA Planning Tool
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Plan your academic path to achieve your target GPA. Set scenarios and see what grades you need to reach your goals.
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
                  Planning Scenarios
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Set up your planning scenarios below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Current Status and Target Settings */}
                  <Card className="border-2 border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-pink-600" />
                        Current Status & Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Current GPA
                          </label>
                          <Input
                            type="number"
                            placeholder="3.2"
                            min="0"
                            max="4.0"
                            step="0.01"
                            value={currentGPA || ''}
                            onChange={(e) => setCurrentGPA(parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400 h-10"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Current Credits
                          </label>
                          <Input
                            type="number"
                            placeholder="60"
                            min="0"
                            step="0.5"
                            value={currentCredits || ''}
                            onChange={(e) => setCurrentCredits(parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400 h-10"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Target GPA
                          </label>
                          <Input
                            type="number"
                            placeholder="3.5"
                            min="0"
                            max="4.0"
                            step="0.01"
                            value={targetGPA || ''}
                            onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 0)}
                            className="border-2 border-gray-300 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-400 h-10"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Planning Scenario Boxes */}
                  {semesters.map((semesterScenarios, semesterIndex) => (
                    <Card key={semesterIndex} className="border-2 border-gray-200 dark:border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Planning Group {semesterIndex + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Column Headers */}
                          <div className="grid grid-cols-4 gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b">
                            <div>Scenario Name</div>
                            <div>Target Grade</div>
                            <div>Credits</div>
                            <div>Action</div>
                          </div>

                          {/* Scenario Rows */}
                          <div className="space-y-3">
                            {semesterScenarios.map((scenario, scenarioIndex) => (
                              <motion.div 
                                key={scenario.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-4 gap-3 items-center"
                              >
                                <Input
                                  placeholder={`Scenario ${scenarioIndex + 1}`}
                                  value={scenario.name}
                                  onChange={(e) => updateCourse(semesterIndex, scenario.id, 'name', e.target.value)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Select 
                                  value={scenario.grade} 
                                  onValueChange={(value) => updateCourse(semesterIndex, scenario.id, 'grade', value)}
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
                                  value={scenario.credits || ''}
                                  onChange={(e) => updateCourse(semesterIndex, scenario.id, 'credits', parseFloat(e.target.value) || 0)}
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-10"
                                />
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCourse(semesterIndex, scenario.id)}
                                  className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={semesterScenarios.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>

                          {/* Add Scenario Button */}
                          <Button 
                            onClick={() => addCourse(semesterIndex)}
                            variant="outline"
                            className="w-full h-10 border-2 border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Scenario
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
                      onClick={calculateProjections} 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Projections
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
              <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Planning Results</CardTitle>
                <CardDescription className="text-pink-100">
                  Your GPA projections and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Achievability Status */}
                  <div className={`flex items-center gap-3 p-4 rounded-lg ${
                    isAchievable 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {isAchievable ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {isAchievable ? 'Goal Achievable!' : 'Goal Not Achievable'}
                      </div>
                    </div>
                  </div>

                  {/* Projected GPA Display with Circular Meter */}
                  <div className="text-center">
                    <CircularMeter value={projectedGPA} maxValue={4.0} size={180} strokeWidth={14}>
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-1" style={{ 
                          color: projectedGPA >= 3.7 ? '#10b981' : projectedGPA >= 3.0 ? '#3b82f6' : projectedGPA >= 2.5 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {projectedGPA.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Projected GPA
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Current Planning
                        </div>
                      </div>
                    </CircularMeter>
                  </div>

                  {/* Required GPA Display */}
                  {isAchievable && requiredGPA > 0 && (
                    <div className="text-center border-t pt-4">
                      <div className="text-4xl font-bold mb-2 text-orange-600 dark:text-orange-400">
                        {requiredGPA.toFixed(2)}
                      </div>
                      <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                        Required GPA
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        To reach {targetGPA.toFixed(2)} target
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current GPA:</span>
                      <span className="text-sm font-bold">{currentGPA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Target GPA:</span>
                      <span className="text-sm font-bold">{targetGPA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Planned Credits:</span>
                      <span className="text-sm font-bold">{totalPlannedCredits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Credits:</span>
                      <span className="text-sm font-bold">{currentCredits + totalPlannedCredits}</span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Planning Status</div>
                    <div className={`text-lg font-bold ${
                      projectedGPA >= targetGPA ? 'text-green-600 dark:text-green-400' :
                      isAchievable ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {projectedGPA >= targetGPA ? 'On Track' :
                       isAchievable ? 'Needs Improvement' :
                       'Revise Plan'}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Other Calculators</div>
                    <Link to="/calculators/semester-gpa">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Semester GPA Calculator
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

export { GPAPlanningTool };