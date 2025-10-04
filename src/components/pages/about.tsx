import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useCMS } from '../cms/cms-context';
import { 
  Users, 
  Target, 
  Award, 
  Heart,
  Lightbulb,
  TrendingUp,
  Globe,
  CheckCircle
} from 'lucide-react';

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Educational Technology Director",
    image: "https://images.unsplash.com/photo-1543295523-78c9bbdba65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwaGFwcHklMjBzdWNjZXNzfGVufDF8fHx8MTc1NzgzODQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Ph.D. in Educational Psychology with 15 years of experience in academic assessment and student success strategies."
  },
  {
    name: "Prof. Michael Chen", 
    role: "Academic Analytics Lead",
    image: "https://images.unsplash.com/photo-1716337563114-365568c4db60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VsZWJyYXRpb24lMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NTc4Mzg0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Former admissions officer and current professor specializing in GPA analysis and college preparation strategies."
  },
  {
    name: "Emma Rodriguez",
    role: "Student Success Specialist",
    image: "https://images.unsplash.com/photo-1606235729070-5da8437f6e30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHN1Y2Nlc3MlMjBtb3RpdmF0aW9ufGVufDF8fHx8MTc1NzgzODQzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Educational consultant who helps students develop effective study strategies and achieve their academic goals."
  }
];

const achievements = [
  { number: "50,000+", label: "Students Helped" },
  { number: "99.9%", label: "Calculation Accuracy" },
  { number: "4.9/5", label: "User Satisfaction" },
  { number: "24/7", label: "Availability" }
];

// Simple markdown-like formatter for CMS content
const formatContent = (content: string) => {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{line.slice(2)}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mb-4 mt-8">{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mb-3 mt-6">{line.slice(4)}</h3>;
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
    return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
  });
};

export function AboutUs() {
  const { data } = useCMS();
  const aboutPage = data.pages.about;

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
              <Users className="w-4 h-4 mr-2" />
              About Us
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {aboutPage.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering students with the tools and knowledge they need to achieve academic success.
          </p>
        </motion.div>

        {/* CMS Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="text-gray-700 dark:text-gray-300">
                  {formatContent(aboutPage.content)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We provide precise calculations and reliable tools that students can trust for their academic planning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Student-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Every feature is designed with students in mind, focusing on usability and educational value.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Free, accessible tools that break down barriers to academic success for students everywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}