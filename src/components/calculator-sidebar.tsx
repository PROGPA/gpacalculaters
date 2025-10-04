import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calculator,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  ChevronRight
} from 'lucide-react';

const calculators = [
  {
    title: 'College GPA',
    path: '/calculators/college-gpa',
    icon: Calculator,
    badge: 'Popular',
    badgeVariant: 'default' as const
  },
  {
    title: 'High School GPA',
    path: '/calculators/high-school-gpa',
    icon: BookOpen,
    badge: 'Featured',
    badgeVariant: 'secondary' as const
  }
];

export function CalculatorSidebar() {
  return (
    <div className="w-full space-y-4 max-w-sm">
      {/* Related Calculators - Compact */}
      <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Related Calculators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {calculators.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <Link key={calc.path} to={calc.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 p-3 hover:bg-muted/50 border border-border/20 hover:border-border/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{calc.title}</span>
                        {calc.badge && (
                          <Badge variant={calc.badgeVariant} className="text-xs h-4 px-2">
                            {calc.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-medium">GPA Scale:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>A: 4.0 points</div>
              <div>B: 3.0 points</div>
              <div>C: 2.0 points</div>
              <div>D: 1.0 points</div>
            </div>
          </div>
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Your data is saved locally and automatically updated as you type.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}