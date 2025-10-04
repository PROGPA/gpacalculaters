import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useCMS } from '../cms/cms-context';
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Shield,
  Users,
  Gavel,
  ExternalLink
} from 'lucide-react';

// Simple markdown-like formatter for CMS content
const formatContent = (content: string) => {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">{line.slice(4)}</h3>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={index} className="font-bold mb-3">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('- ')) {
      return <li key={index} className="mb-2 ml-4 list-disc">{line.slice(2)}</li>;
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    if (line.trim() === '---') {
      return <hr key={index} className="my-8 border-gray-200 dark:border-gray-700" />;
    }
    if (line.startsWith('*Last updated:')) {
      return <p key={index} className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">{line}</p>;
    }
    return <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{line}</p>;
  });
};

export function TermsConditions() {
  const { data } = useCMS();
  const termsPage = data.pages.terms;

  const keyTerms = [
    {
      icon: CheckCircle,
      title: "Acceptance",
      description: "By using our service, you agree to these terms and conditions."
    },
    {
      icon: Shield,
      title: "Use License",
      description: "Personal, non-commercial use of our GPA calculation tools."
    },
    {
      icon: AlertTriangle,
      title: "Accuracy",
      description: "Results should be verified with your educational institution."
    },
    {
      icon: Users,
      title: "User Conduct",
      description: "Respect others and use the service for lawful purposes only."
    }
  ];

  const quickLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Contact Us", href: "/contact" },
    { title: "About Us", href: "/about" }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Terms & Conditions
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {termsPage.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using our GPA calculator services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {formatContent(termsPage.content)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Key Terms */}
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  Key Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {keyTerms.map((item, index) => (
                  <div key={item.title} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Document Info */}
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Document Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Last Updated:</strong><br />
                  {new Date(termsPage.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm">
                  <strong>Version:</strong><br />
                  1.0
                </div>
                <div className="text-sm">
                  <strong>Effective Date:</strong><br />
                  January 1, 2024
                </div>
                <div className="text-sm">
                  <strong>Governed by:</strong><br />
                  United States Law
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-0 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">
                    Important Notice
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                    GPA calculations are for planning purposes. Always verify results with your institution.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Related Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link) => (
                  <Button 
                    key={link.title}
                    variant="ghost" 
                    className="w-full justify-start p-2 h-auto"
                    asChild
                  >
                    <a href={link.href}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.title}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Legal Contact */}
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="p-6 text-center">
                <Gavel className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Legal Questions?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Contact us for legal inquiries or terms clarification.
                </p>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  legal@gpacalculatorpro.com
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}