import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { CMSProvider } from './components/cms/cms-context';
import { AdminLayout } from './components/cms/admin-layout';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { HomePage } from './components/pages/home';
import { CollegeGPACalculator } from './components/pages/college-gpa';
import { HighSchoolGPACalculator } from './components/pages/high-school-gpa';
import { EZGrader } from './components/pages/ez-grader';
import { FinalGradeCalculator } from './components/pages/final-grade';
import { SemesterGPACalculator } from './components/pages/semester-gpa';
import { GPAPlanningTool } from './components/pages/gpa-planning';
import { SGPAToCGPAConverter } from './components/pages/sgpa-to-cgpa';
import { MiddleSchoolGPACalculator } from './components/pages/middle-school-gpa';
import { CumulativeGPA } from './components/pages/cumulative-gpa';
import { BlogIndex } from './components/pages/blog-index';
import { BlogPost } from './components/pages/blog-post';
import { AboutUs } from './components/pages/about';
import { Contact } from './components/pages/contact';
import { PrivacyPolicy } from './components/pages/privacy';
import { TermsConditions } from './components/pages/terms';
import { NotFound } from './components/pages/not-found';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <Router>
          <Routes>
            {/* CMS Admin Route - Full screen without navigation */}
            <Route path="/admin" element={<AdminLayout />} />
            
            {/* Main Website Routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-all duration-500">
                <Navigation />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/calculators/college-gpa" element={<CollegeGPACalculator />} />
                    <Route path="/calculators/high-school-gpa" element={<HighSchoolGPACalculator />} />
                    <Route path="/calculators/ez-grader" element={<EZGrader />} />
                    <Route path="/calculators/final-grade" element={<FinalGradeCalculator />} />
                    <Route path="/calculators/semester-gpa" element={<SemesterGPACalculator />} />
                    <Route path="/calculators/gpa-planning" element={<GPAPlanningTool />} />
                    <Route path="/calculators/sgpa-to-cgpa" element={<SGPAToCGPAConverter />} />
                    <Route path="/calculators/middle-school-gpa" element={<MiddleSchoolGPACalculator />} />
                    <Route path="/calculators/cumulative-gpa" element={<CumulativeGPA />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    {/* Redirect all unknown routes to home */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            } />
          </Routes>
        </Router>
      </CMSProvider>
    </ThemeProvider>
  );
}