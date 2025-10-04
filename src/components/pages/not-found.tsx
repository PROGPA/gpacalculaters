import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
              >
                404
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/calculators/college-gpa">
                    <Search className="w-4 h-4 mr-2" />
                    Try Calculator
                  </Link>
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Looking for something specific? Try these popular pages:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/calculators/college-gpa">College GPA Calculator</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/calculators/high-school-gpa">High School GPA</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/blog">Blog</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/about">About Us</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}