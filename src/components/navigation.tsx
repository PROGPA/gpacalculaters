import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { useCMS } from './cms/cms-context';
import { Button } from './ui/button';
import { LanguageSelector } from './language-selector';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

import { 
  Moon, 
  Sun, 
  Calculator, 
  Menu, 
  GraduationCap,
  BookOpen,
  Users,
  Mail,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  History,
  CheckCircle,
  School
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  Calculator,
  GraduationCap,
  BookOpen,
  Users,
  Mail,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  History,
  CheckCircle,
  School
};

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const { data } = useCMS();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);


  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };



  // Get calculator navigation items with proper icons
  const getCalculatorItems = () => {
    const calculatorsNavItem = data.navigation.mainNavigation.find(item => 
      item.label.toLowerCase().includes('calculator') || item.href.includes('calculator')
    );
    
    if (calculatorsNavItem && calculatorsNavItem.children) {
      return calculatorsNavItem.children.map(child => {
        // Map calculator to appropriate icon and description based on the calculator data
        const calculatorId = child.href.split('/').pop();
        const calculatorData = calculatorId && data.calculators[calculatorId];
        
        let icon = Calculator;
        let description = child.label;
        
        if (calculatorData) {
          description = calculatorData.subtitle || calculatorData.description;
          
          // Assign icons based on calculator type
          if (calculatorId?.includes('college')) icon = GraduationCap;
          else if (calculatorId?.includes('high-school')) icon = School;
          else if (calculatorId?.includes('middle-school')) icon = Users;
          else if (calculatorId?.includes('ez-grader')) icon = CheckCircle;
          else if (calculatorId?.includes('final')) icon = Target;
          else if (calculatorId?.includes('semester')) icon = TrendingUp;
          else if (calculatorId?.includes('planning')) icon = BarChart3;
          else if (calculatorId?.includes('cumulative')) icon = History;
          else icon = Calculator;
        }
        
        return {
          title: child.label,
          href: child.href,
          description,
          icon
        };
      });
    }
    
    return [];
  };

  const calculatorItems = getCalculatorItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {data.navigation.logo.text}
              </span>
              {data.navigation.logo.subtext && (
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden lg:block">
                  {data.navigation.logo.subtext}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {data.navigation.mainNavigation.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.children && item.children.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[400px] p-4 space-y-1">
                            {item.label.toLowerCase().includes('calculator') ? (
                              calculatorItems.map((calcItem) => (
                                <NavigationMenuLink key={calcItem.href} asChild>
                                  <Link
                                    to={calcItem.href}
                                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <calcItem.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <div className="text-sm font-medium leading-none">{calcItem.title}</div>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              ))
                            ) : (
                              item.children.map((child, childIndex) => (
                                <NavigationMenuLink key={childIndex} asChild>
                                  <Link
                                    to={child.href}
                                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">{child.label}</div>
                                  </Link>
                                </NavigationMenuLink>
                              ))
                            )}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                            location.pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>



            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden w-9 h-9 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold">{data.navigation.logo.text}</span>
                  </div>
                  
                  {data.navigation.mainNavigation.map((item, index) => (
                    <div key={index}>
                      {item.children && item.children.length > 0 ? (
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100 py-2">
                            {item.label}
                          </div>
                          <div className="pl-4 space-y-1">
                            {item.children.map((child, childIndex) => (
                              <Link
                                key={childIndex}
                                to={child.href}
                                className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setIsOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className="block py-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}

                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}