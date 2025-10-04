import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  tags: string[];
  featuredImage: string;
  readTime: number;
}

export interface PageContent {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface NavigationContent {
  logo: {
    text: string;
    subtext: string;
  };
  mainNavigation: NavigationItem[];
  authButtons: {
    login: string;
    signup: string;
  };
}

export interface FooterContent {
  companyInfo: {
    name: string;
    description: string;
    copyright: string;
  };
  links: {
    title: string;
    items: NavigationItem[];
  }[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export interface CalculatorContent {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonText: string;
  placeholders: Record<string, string>;
  labels: Record<string, string>;
  helpTexts: Record<string, string>;
  successMessages: string[];
  tips: string[];
}

export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  calculators: {
    title: string;
    subtitle: string;
    featured: {
      title: string;
      description: string;
      href: string;
      icon: string;
    }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      content: string;
      rating: number;
    }[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface CMSData {
  articles: BlogArticle[];
  pages: Record<string, PageContent>;
  navigation: NavigationContent;
  footer: FooterContent;
  homepage: HomePageContent;
  calculators: Record<string, CalculatorContent>;
  settings: {
    siteName: string;
    siteDescription: string;
    defaultAuthor: string;
    primaryColor: string;
    secondaryColor: string;
    language: string;
    timezone: string;
  };
}

interface CMSContextType {
  data: CMSData;
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updatePage: (pageId: string, page: Partial<PageContent>) => void;
  updateNavigation: (navigation: Partial<NavigationContent>) => void;
  updateFooter: (footer: Partial<FooterContent>) => void;
  updateHomepage: (homepage: Partial<HomePageContent>) => void;
  updateCalculator: (calculatorId: string, calculator: Partial<CalculatorContent>) => void;
  updateSettings: (settings: Partial<CMSData['settings']>) => void;
  createArticle: (article: Omit<BlogArticle, 'id' | 'publishedAt' | 'updatedAt'>) => void;
  updateArticle: (id: string, article: Partial<BlogArticle>) => void;
  deleteArticle: (id: string) => void;
  getArticleBySlug: (slug: string) => BlogArticle | undefined;
  getPublishedArticles: () => BlogArticle[];
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const defaultData: CMSData = {
  articles: [
    {
      id: '1',
      title: 'How to Calculate Your College GPA: A Complete Guide',
      slug: 'how-to-calculate-college-gpa-guide',
      excerpt: 'Learn the essential steps to calculate your college GPA accurately, understand different grading scales, and discover tips to improve your academic performance.',
      content: `
# How to Calculate Your College GPA: A Complete Guide

Your Grade Point Average (GPA) is one of the most important metrics in your academic journey. Whether you're applying for graduate school, seeking internships, or pursuing scholarships, understanding how to calculate and maintain a strong GPA is crucial.

## Understanding GPA Basics

GPA is calculated by dividing the total number of grade points earned by the total number of credit hours attempted. Each letter grade corresponds to a specific point value:

- A: 4.0 points
- B: 3.0 points  
- C: 2.0 points
- D: 1.0 points
- F: 0.0 points

## Step-by-Step Calculation

1. **List all your courses** with their respective credit hours
2. **Assign point values** to each grade received
3. **Multiply** grade points by credit hours for each course
4. **Sum** all the quality points
5. **Divide** by total credit hours

## Tips for GPA Success

- Attend all classes regularly
- Participate actively in discussions
- Seek help when needed
- Maintain good study habits
- Use our GPA calculator tools for planning

Remember, your GPA is important, but it's not everything. Focus on learning and personal growth alongside maintaining good grades.
`,
      author: 'GPA Calculator Pro Team',
      publishedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      status: 'published',
      tags: ['GPA', 'College', 'Study Tips', 'Academic Success'],
      featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
      readTime: 5
    },
    {
      id: '2',
      title: 'High School vs College GPA: What You Need to Know',
      slug: 'high-school-vs-college-gpa-differences',
      excerpt: 'Discover the key differences between high school and college GPA calculations, including weighted vs unweighted grades and their impact on college admissions.',
      content: `
# High School vs College GPA: What You Need to Know

The transition from high school to college brings many changes, including how your GPA is calculated and what it means for your academic future.

## Key Differences

### High School GPA
- Often uses weighted systems for AP/IB courses
- Scale may extend beyond 4.0
- Includes all attempted courses
- More standardized across schools

### College GPA  
- Typically unweighted 4.0 scale
- Only includes completed courses
- Varies by institution
- More flexible course selection

## Impact on Your Future

Understanding these differences helps you:
- Set realistic expectations
- Plan your course load effectively
- Prepare for graduate school applications
- Make informed academic decisions

Use our specialized calculators to understand both systems and plan your academic journey effectively.
`,
      author: 'Academic Advisor Team',
      publishedAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      status: 'published',
      tags: ['High School', 'College', 'GPA Comparison', 'Academic Planning'],
      featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      readTime: 4
    }
  ],
  pages: {
    about: {
      id: 'about',
      title: 'About GPA Calculator Pro',
      content: `
# About GPA Calculator Pro

Welcome to the most advanced GPA calculation platform designed specifically for students who want to take control of their academic journey.

## Our Mission

We believe that every student deserves access to powerful, accurate, and easy-to-use tools that help them understand and improve their academic performance. Our platform combines cutting-edge technology with student-friendly design to deliver an exceptional experience.

## What Makes Us Different

- **Comprehensive Calculator Suite**: From college GPA to middle school grades, we cover every academic level
- **Advanced Features**: AI-powered study tips, progress visualization, and milestone celebrations
- **Student-Focused Design**: Clean, modern interface that's easy to navigate and understand
- **Always Free**: Core features remain free because education should be accessible to everyone

## Our Tools

- College GPA Calculator with weighted course support
- High School GPA Calculator (weighted and unweighted)
- EZ Grader for quick test scoring
- Final Grade Calculator for exam planning
- Semester GPA tracking
- GPA Planning tools for goal setting
- SGPA to CGPA conversion
- Middle School GPA calculator
- Cumulative GPA tracking across semesters

## Privacy & Security

Your academic data is personal and important. We use industry-standard security practices to protect your information and never share your data with third parties.

## Get Started

Ready to take control of your academic success? Try our calculators today and discover how easy it is to track, plan, and improve your GPA.
`,
      updatedAt: '2024-01-01T12:00:00Z',
      seoTitle: 'About GPA Calculator Pro - Advanced GPA Tools for Students',
      seoDescription: 'Learn about GPA Calculator Pro, the most comprehensive platform for calculating and tracking your academic performance across all education levels.'
    },
    contact: {
      id: 'contact',
      title: 'Contact Us',
      content: `
# Contact GPA Calculator Pro

We're here to help you succeed academically. Whether you have questions about our calculators, need technical support, or want to share feedback, we'd love to hear from you.

## Get in Touch

### General Inquiries
**Email**: info@gpacalculatorpro.com
**Response Time**: Within 24 hours

### Technical Support
**Email**: support@gpacalculatorpro.com
**Response Time**: Within 12 hours

### Partnership Opportunities
**Email**: partnerships@gpacalculatorpro.com

## Frequently Asked Questions

### How accurate are your GPA calculators?
Our calculators use standard academic formulas and are designed to provide accurate results based on the information you input. However, always verify with your institution's specific policies.

### Do you store my academic data?
We prioritize your privacy. Data is stored locally on your device and is never shared with third parties.

### Can I suggest new features?
Absolutely! We love hearing from our users. Send us your ideas and we'll consider them for future updates.

### Is the platform really free?
Yes, our core GPA calculation tools are completely free. We may introduce premium features in the future, but the essential tools will always remain free.

## Office Hours

**Monday - Friday**: 9:00 AM - 6:00 PM EST
**Saturday - Sunday**: 10:00 AM - 4:00 PM EST

## Mailing Address

GPA Calculator Pro
123 Education Street
Academic City, AC 12345
United States

---

*We typically respond to all inquiries within 24 hours. For urgent technical issues, please include "URGENT" in your subject line.*
`,
      updatedAt: '2024-01-01T12:00:00Z',
      seoTitle: 'Contact GPA Calculator Pro - Get Help & Support',
      seoDescription: 'Need help with GPA calculations or have questions? Contact our support team for quick assistance with our GPA calculator tools.'
    },
    privacy: {
      id: 'privacy',
      title: 'Privacy Policy',
      content: `
# Privacy Policy

*Last updated: January 1, 2024*

At GPA Calculator Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.

## Information We Collect

### Personal Information
- Email address (for newsletter subscription, if opted in)
- Name (if provided for user accounts)

### Usage Data
- GPA calculations and academic data (stored locally on your device)
- Website usage analytics (anonymized)
- Technical information (browser type, device information)

### Cookies and Local Storage
We use local storage to save your calculator inputs and preferences for a better user experience.

## How We Use Your Information

- To provide and improve our GPA calculation services
- To respond to your inquiries and provide customer support
- To send educational content (only if you opt in)
- To analyze usage patterns and improve our platform

## Data Storage and Security

- Academic data is stored locally on your device
- We use industry-standard security measures
- We do not sell or share your personal information
- Data transmission is encrypted using SSL

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your personal information
- Opt out of communications

## Third-Party Services

We may use third-party services for analytics and functionality. These services have their own privacy policies that govern their use of your information.

## Children's Privacy

Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at privacy@gpacalculatorpro.com.
`,
      updatedAt: '2024-01-01T12:00:00Z',
      seoTitle: 'Privacy Policy - GPA Calculator Pro',
      seoDescription: 'Learn how GPA Calculator Pro protects your privacy and handles your academic data securely.'
    },
    terms: {
      id: 'terms',
      title: 'Terms & Conditions',
      content: `
# Terms & Conditions

*Last updated: January 1, 2024*

Welcome to GPA Calculator Pro. These Terms of Service govern your use of our website and services.

## Acceptance of Terms

By accessing and using GPA Calculator Pro, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily download one copy of GPA Calculator Pro for personal, non-commercial transitory viewing only.

### This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.

## Disclaimer

The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, GPA Calculator Pro excludes all representations, warranties, conditions and terms related to our website and your use of this website.

## Accuracy of Calculations

While we strive to provide accurate GPA calculations, results should be verified with your educational institution. We are not responsible for any decisions made based on our calculations.

## User Responsibilities

- Provide accurate information for calculations
- Use the service for lawful purposes only
- Respect intellectual property rights
- Not attempt to disrupt or damage the service

## Limitation of Liability

GPA Calculator Pro shall not be held liable for any damages arising from the use or inability to use this service.

## Content Ownership

The content, design, and structure of this website are owned by GPA Calculator Pro and are protected by copyright and other intellectual property laws.

## User-Generated Content

Any academic data you input remains your property. We do not claim ownership of your personal academic information.

## Modifications

We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.

## Governing Law

These terms are governed by the laws of the United States and the state in which our company is incorporated.

## Contact Information

For questions about these Terms & Conditions, contact us at legal@gpacalculatorpro.com.

## Severability

If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
`,
      updatedAt: '2024-01-01T12:00:00Z',
      seoTitle: 'Terms & Conditions - GPA Calculator Pro',
      seoDescription: 'Read the terms and conditions for using GPA Calculator Pro services and tools.'
    }
  },
  navigation: {
    logo: {
      text: 'GPA Calculator Pro',
      subtext: 'Academic Success Made Simple'
    },
    mainNavigation: [
      {
        label: 'Calculators',
        href: '/calculators',
        children: [
          { label: 'College GPA', href: '/calculators/college-gpa' },
          { label: 'High School GPA', href: '/calculators/high-school-gpa' },
          { label: 'EZ Grader', href: '/calculators/ez-grader' },
          { label: 'Final Grade', href: '/calculators/final-grade' },
          { label: 'Semester GPA', href: '/calculators/semester-gpa' },
          { label: 'GPA Planning', href: '/calculators/gpa-planning' },
          { label: 'SGPA to CGPA', href: '/calculators/sgpa-to-cgpa' },
          { label: 'Middle School', href: '/calculators/middle-school-gpa' },
          { label: 'Cumulative GPA', href: '/calculators/cumulative-gpa' }
        ]
      }
    ],
    authButtons: {
      login: 'Log In',
      signup: 'Sign Up'
    }
  },
  footer: {
    companyInfo: {
      name: 'GPA Calculator Pro',
      description: 'The most advanced GPA calculator platform designed for students who want to excel academically.',
      copyright: '© 2024 GPA Calculator Pro. All rights reserved.'
    },
    links: [
      {
        title: 'Calculators',
        items: [
          { label: 'College GPA', href: '/calculators/college-gpa' },
          { label: 'High School GPA', href: '/calculators/high-school-gpa' },
          { label: 'EZ Grader', href: '/calculators/ez-grader' },
          { label: 'Final Grade', href: '/calculators/final-grade' }
        ]
      },
      {
        title: 'Company',
        items: [
          { label: 'Blog', href: '/blog' },
          { label: 'About Us', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms & Conditions', href: '/terms' }
        ]
      }
    ],
    contact: {
      email: 'support@gpacalculatorpro.com',
      phone: '+1 (555) 123-4567',
      address: '123 Education Street, Academic City, AC 12345'
    },
    social: [
      { platform: 'Twitter', url: 'https://twitter.com/gpacalculatorpro', icon: 'Twitter' },
      { platform: 'Facebook', url: 'https://facebook.com/gpacalculatorpro', icon: 'Facebook' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/gpacalculatorpro', icon: 'Linkedin' },
      { platform: 'Instagram', url: 'https://instagram.com/gpacalculatorpro', icon: 'Instagram' }
    ]
  },
  homepage: {
    hero: {
      title: 'Master Your Academic Success',
      subtitle: 'The Most Advanced GPA Calculator Platform',
      description: 'Calculate, track, and improve your GPA with our comprehensive suite of tools designed for students at every level.',
      primaryButton: 'Start Calculating',
      secondaryButton: 'Learn More'
    },
    features: {
      title: 'Everything You Need for Academic Success',
      subtitle: 'Powerful tools designed with students in mind',
      items: [
        {
          title: 'Accurate Calculations',
          description: 'Precise GPA calculations using standard academic formulas with support for weighted and unweighted grades.',
          icon: 'Calculator'
        },
        {
          title: 'Progress Tracking',
          description: 'Visual charts and progress indicators to help you track your academic performance over time.',
          icon: 'TrendingUp'
        },
        {
          title: 'Goal Planning',
          description: 'Set academic goals and plan your path to achieving your target GPA with our planning tools.',
          icon: 'Target'
        },
        {
          title: 'Multi-Level Support',
          description: 'Calculators for middle school, high school, college, and graduate programs with specific features for each.',
          icon: 'GraduationCap'
        }
      ]
    },
    calculators: {
      title: 'Choose Your Calculator',
      subtitle: 'Select the perfect tool for your academic level',
      featured: [
        {
          title: 'College GPA Calculator',
          description: 'Advanced calculator with support for semester systems, weighted courses, and credit hours.',
          href: '/calculators/college-gpa',
          icon: 'GraduationCap'
        },
        {
          title: 'High School GPA',
          description: 'Calculate both weighted and unweighted GPAs with support for AP, IB, and honors courses.',
          href: '/calculators/high-school-gpa',
          icon: 'School'
        },
        {
          title: 'EZ Grader',
          description: 'Quick and easy percentage-based grading for tests, quizzes, and assignments.',
          href: '/calculators/ez-grader',
          icon: 'CheckCircle'
        },
        {
          title: 'Final Grade Calculator',
          description: 'Determine what you need on your final exam to achieve your target grade.',
          href: '/calculators/final-grade',
          icon: 'Target'
        }
      ]
    },
    testimonials: {
      title: 'Trusted by Students Worldwide',
      subtitle: 'See what students are saying about our platform',
      items: [
        {
          name: 'Sarah Johnson',
          role: 'College Student',
          content: 'This platform helped me track my GPA and plan my course load effectively. The visualizations are amazing!',
          rating: 5
        },
        {
          name: 'Michael Chen',
          role: 'High School Senior',
          content: 'Finally found a GPA calculator that handles weighted courses correctly. Helped me get into my dream college!',
          rating: 5
        },
        {
          name: 'Emily Rodriguez',
          role: 'Graduate Student',
          content: 'The planning tools are incredible. I can see exactly what grades I need to maintain my scholarship.',
          rating: 5
        }
      ]
    },
    cta: {
      title: 'Ready to Take Control of Your Academic Success?',
      description: 'Join thousands of students who are already using our tools to achieve their academic goals.',
      buttonText: 'Start Your Journey'
    }
  },
  calculators: {
    'college-gpa': {
      title: 'College GPA Calculator',
      subtitle: 'Advanced GPA calculation for college students',
      description: 'Calculate your college GPA with precision using our advanced calculator that supports semester systems, weighted courses, and credit hours.',
      features: [
        'Support for semester and quarter systems',
        'Weighted course calculations',
        'Credit hour tracking',
        'Cumulative GPA across multiple semesters',
        'Grade prediction and planning tools'
      ],
      buttonText: 'Calculate GPA',
      placeholders: {
        courseName: 'Enter course name',
        grade: 'Select grade',
        credits: 'Credit hours'
      },
      labels: {
        courseName: 'Course Name',
        grade: 'Grade',
        credits: 'Credit Hours',
        gpa: 'Current GPA',
        totalCredits: 'Total Credits'
      },
      helpTexts: {
        grade: 'Select the letter grade you received for this course',
        credits: 'Enter the number of credit hours for this course',
        planning: 'Use the planning mode to see what grades you need for target GPA'
      },
      successMessages: [
        'Great job! Your GPA is looking strong!',
        'Excellent work maintaining your academic performance!',
        'Keep up the fantastic effort!'
      ],
      tips: [
        'Maintain consistent study habits throughout the semester',
        'Don\'t be afraid to ask professors for help during office hours',
        'Form study groups with classmates for difficult subjects',
        'Use the planning tools to set realistic academic goals'
      ]
    },
    'high-school-gpa': {
      title: 'High School GPA Calculator',
      subtitle: 'Weighted and unweighted GPA calculations',
      description: 'Calculate your high school GPA with support for both weighted and unweighted systems, including AP, IB, and honors courses.',
      features: [
        'Weighted and unweighted calculations',
        'AP, IB, and honors course support',
        'College admission GPA formatting',
        'Grade trend analysis',
        'Scholarship eligibility tracking'
      ],
      buttonText: 'Calculate GPA',
      placeholders: {
        courseName: 'Enter course name',
        grade: 'Select grade',
        courseType: 'Course type'
      },
      labels: {
        courseName: 'Course Name',
        grade: 'Grade',
        courseType: 'Course Type',
        weightedGPA: 'Weighted GPA',
        unweightedGPA: 'Unweighted GPA'
      },
      helpTexts: {
        courseType: 'Select Regular, Honors, AP, or IB for proper weighting',
        weighted: 'Weighted GPA accounts for course difficulty levels',
        unweighted: 'Unweighted GPA treats all courses equally (4.0 scale)'
      },
      successMessages: [
        'Outstanding academic performance!',
        'You\'re on track for great college opportunities!',
        'Keep pushing towards your academic goals!'
      ],
      tips: [
        'Take challenging courses like AP or IB to boost weighted GPA',
        'Focus on maintaining strong grades in core subjects',
        'Consider how your GPA impacts college applications',
        'Use extracurricular activities to complement your academic record'
      ]
    },
    'ez-grader': {
      title: 'EZ Grader',
      subtitle: 'Quick percentage and letter grade calculator',
      description: 'Instantly calculate test scores, quiz grades, and assignment percentages with our easy-to-use grading tool.',
      features: [
        'Instant percentage calculations',
        'Letter grade conversions',
        'Customizable grading scales',
        'Bulk grade calculations',
        'Grade distribution analysis'
      ],
      buttonText: 'Calculate Grade',
      placeholders: {
        totalQuestions: 'Total questions',
        wrongAnswers: 'Wrong answers',
        percentage: 'Percentage'
      },
      labels: {
        totalQuestions: 'Total Questions',
        wrongAnswers: 'Wrong Answers',
        correctAnswers: 'Correct Answers',
        percentage: 'Percentage',
        letterGrade: 'Letter Grade'
      },
      helpTexts: {
        totalQuestions: 'Enter the total number of questions on the test',
        wrongAnswers: 'Enter how many questions were answered incorrectly',
        gradeScale: 'Grade scale can be customized in settings'
      },
      successMessages: [
        'Great test score!',
        'Nice work on that assignment!',
        'Keep up the excellent performance!'
      ],
      tips: [
        'Review incorrect answers to learn from mistakes',
        'Look for patterns in the types of questions missed',
        'Celebrate improvement over time, not just perfect scores',
        'Use practice tests to identify weak areas'
      ]
    },
    'final-grade': {
      title: 'Final Grade Calculator',
      subtitle: 'Plan your final exam strategy',
      description: 'Determine exactly what score you need on your final exam to achieve your target course grade.',
      features: [
        'Target grade planning',
        'Current grade analysis',
        'Final exam weight calculation',
        'Multiple scenario planning',
        'Grade improvement strategies'
      ],
      buttonText: 'Calculate Required Score',
      placeholders: {
        currentGrade: 'Current grade %',
        targetGrade: 'Target grade %',
        finalWeight: 'Final exam weight %'
      },
      labels: {
        currentGrade: 'Current Grade',
        targetGrade: 'Target Grade',
        finalWeight: 'Final Exam Weight',
        requiredScore: 'Required Final Score'
      },
      helpTexts: {
        currentGrade: 'Your current grade percentage before the final exam',
        targetGrade: 'The final grade percentage you want to achieve',
        finalWeight: 'How much the final exam counts toward your total grade'
      },
      successMessages: [
        'You\'ve got this! Focus your study efforts wisely.',
        'Your target is achievable with focused preparation!',
        'Great planning! Now execute your study strategy.'
      ],
      tips: [
        'Start studying early rather than cramming',
        'Focus extra time on your weakest topics',
        'Take practice exams under timed conditions',
        'Get plenty of rest before the exam day'
      ]
    },
    'semester-gpa': {
      title: 'Semester GPA Calculator',
      subtitle: 'Track your semester performance',
      description: 'Calculate your GPA for individual semesters and see how it impacts your cumulative GPA.',
      features: [
        'Individual semester tracking',
        'Cumulative GPA impact analysis',
        'Credit hour weighting',
        'Grade trend visualization',
        'Academic probation alerts'
      ],
      buttonText: 'Calculate Semester GPA',
      placeholders: {
        courseName: 'Course name',
        grade: 'Final grade',
        credits: 'Credit hours'
      },
      labels: {
        courseName: 'Course Name',
        grade: 'Grade',
        credits: 'Credit Hours',
        semesterGPA: 'Semester GPA',
        cumulativeGPA: 'Cumulative GPA'
      },
      helpTexts: {
        semester: 'Add all courses from a single semester',
        cumulative: 'Shows how this semester affects your overall GPA',
        credits: 'Include all credit hours for accurate calculations'
      },
      successMessages: [
        'Excellent semester performance!',
        'You\'re making great academic progress!',
        'Keep up the momentum in future semesters!'
      ],
      tips: [
        'Balance your course load each semester',
        'Take advantage of academic support services',
        'Monitor your progress throughout the semester',
        'Plan ahead for challenging course combinations'
      ]
    },
    'gpa-planning': {
      title: 'GPA Planning Tool',
      subtitle: 'Plan your path to academic success',
      description: 'Set GPA goals and create a strategic plan to achieve them with our comprehensive planning tool.',
      features: [
        'Goal setting and tracking',
        'Course planning recommendations',
        'Credit hour optimization',
        'Graduation timeline planning',
        'Academic milestone alerts'
      ],
      buttonText: 'Create Plan',
      placeholders: {
        targetGPA: 'Target GPA',
        currentGPA: 'Current GPA',
        remainingCredits: 'Remaining credits'
      },
      labels: {
        targetGPA: 'Target GPA',
        currentGPA: 'Current GPA',
        remainingCredits: 'Remaining Credits',
        recommendedGrades: 'Recommended Grades'
      },
      helpTexts: {
        target: 'Enter your desired cumulative GPA',
        planning: 'Tool will calculate what grades you need going forward',
        realistic: 'Make sure your target is realistic and achievable'
      },
      successMessages: [
        'Your plan is set! Stay focused on your goals.',
        'Great planning! Execute consistently for success.',
        'You\'re on track to achieve your academic goals!'
      ],
      tips: [
        'Set realistic but challenging GPA goals',
        'Focus on consistent performance over perfection',
        'Adjust your plan as circumstances change',
        'Celebrate small wins along the way'
      ]
    },
    'sgpa-to-cgpa': {
      title: 'SGPA to CGPA Converter',
      subtitle: 'Convert semester GPA to cumulative GPA',
      description: 'Easily convert between SGPA (Semester Grade Point Average) and CGPA (Cumulative Grade Point Average) for Indian academic systems.',
      features: [
        'SGPA to CGPA conversion',
        'Multiple semester tracking',
        'Credit-based calculations',
        'Academic transcript formatting',
        'Performance trend analysis'
      ],
      buttonText: 'Convert SGPA',
      placeholders: {
        sgpa: 'Enter SGPA',
        semester: 'Semester number',
        credits: 'Credit points'
      },
      labels: {
        sgpa: 'SGPA',
        cgpa: 'CGPA',
        semester: 'Semester',
        credits: 'Credit Points'
      },
      helpTexts: {
        sgpa: 'Enter your Semester Grade Point Average',
        credits: 'Include credit points for accurate CGPA calculation',
        system: 'Follows standard Indian university grading systems'
      },
      successMessages: [
        'Excellent academic performance!',
        'Your CGPA is looking strong!',
        'Keep maintaining this level of excellence!'
      ],
      tips: [
        'Maintain consistency across all semesters',
        'Focus on understanding concepts deeply',
        'Participate actively in classroom discussions',
        'Seek guidance from faculty when needed'
      ]
    },
    'middle-school-gpa': {
      title: 'Middle School GPA Calculator',
      subtitle: 'Track early academic performance',
      description: 'Calculate GPA for middle school students and establish good academic habits early.',
      features: [
        'Age-appropriate grade tracking',
        'Progress monitoring',
        'Parent-friendly reports',
        'Study habit recommendations',
        'High school preparation insights'
      ],
      buttonText: 'Calculate GPA',
      placeholders: {
        subject: 'Subject name',
        grade: 'Grade received',
        weight: 'Course weight'
      },
      labels: {
        subject: 'Subject',
        grade: 'Grade',
        weight: 'Weight',
        gpa: 'GPA'
      },
      helpTexts: {
        grades: 'Enter grades for all your subjects',
        importance: 'Building good habits now helps in high school',
        tracking: 'Regular monitoring helps identify areas for improvement'
      },
      successMessages: [
        'Great job! You\'re building excellent study habits!',
        'Keep up the wonderful work in all your subjects!',
        'You\'re setting yourself up for high school success!'
      ],
      tips: [
        'Develop good study habits early',
        'Ask for help when you don\'t understand something',
        'Stay organized with assignments and deadlines',
        'Participate actively in all your classes'
      ]
    },
    'cumulative-gpa': {
      title: 'Cumulative GPA Calculator',
      subtitle: 'Track your overall academic performance',
      description: 'Calculate and track your cumulative GPA across multiple semesters and academic years.',
      features: [
        'Multi-semester tracking',
        'Academic year summaries',
        'Graduation requirement tracking',
        'Honor roll calculations',
        'Academic standing monitoring'
      ],
      buttonText: 'Calculate Cumulative GPA',
      placeholders: {
        semesterGPA: 'Semester GPA',
        credits: 'Credits earned',
        year: 'Academic year'
      },
      labels: {
        semesterGPA: 'Semester GPA',
        credits: 'Credits',
        year: 'Year',
        cumulativeGPA: 'Cumulative GPA',
        totalCredits: 'Total Credits'
      },
      helpTexts: {
        cumulative: 'Shows your overall academic performance',
        tracking: 'Add each semester to see progression over time',
        goals: 'Monitor progress toward graduation requirements'
      },
      successMessages: [
        'Outstanding cumulative performance!',
        'You\'re maintaining excellent academic standards!',
        'Your hard work is paying off!'
      ],
      tips: [
        'Focus on long-term consistency over short-term perfection',
        'Use setbacks as learning opportunities',
        'Maintain balance between academics and personal life',
        'Celebrate your academic achievements along the way'
      ]
    }
  },
  settings: {
    siteName: 'GPA Calculator Pro',
    siteDescription: 'The most advanced GPA calculator platform for students',
    defaultAuthor: 'GPA Calculator Pro Team',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    language: 'en',
    timezone: 'America/New_York'
  }
};

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(defaultData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('cms-data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to load CMS data:', error);
      }
    }

    // Check if user is logged in
    const savedLoginState = localStorage.getItem('cms-logged-in');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const saveData = (newData: CMSData) => {
    setData(newData);
    localStorage.setItem('cms-data', JSON.stringify(newData));
  };

  const login = (password: string): boolean => {
    // Simple password check - in production, this would be properly secured
    if (password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('cms-logged-in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('cms-logged-in');
  };

  const updatePage = (pageId: string, page: Partial<PageContent>) => {
    const newData = {
      ...data,
      pages: {
        ...data.pages,
        [pageId]: {
          ...data.pages[pageId],
          ...page,
          updatedAt: new Date().toISOString()
        }
      }
    };
    saveData(newData);
  };

  const updateNavigation = (navigation: Partial<NavigationContent>) => {
    const newData = {
      ...data,
      navigation: {
        ...data.navigation,
        ...navigation
      }
    };
    saveData(newData);
  };

  const updateFooter = (footer: Partial<FooterContent>) => {
    const newData = {
      ...data,
      footer: {
        ...data.footer,
        ...footer
      }
    };
    saveData(newData);
  };

  const updateHomepage = (homepage: Partial<HomePageContent>) => {
    const newData = {
      ...data,
      homepage: {
        ...data.homepage,
        ...homepage
      }
    };
    saveData(newData);
  };

  const updateCalculator = (calculatorId: string, calculator: Partial<CalculatorContent>) => {
    const newData = {
      ...data,
      calculators: {
        ...data.calculators,
        [calculatorId]: {
          ...data.calculators[calculatorId],
          ...calculator
        }
      }
    };
    saveData(newData);
  };

  const updateSettings = (settings: Partial<CMSData['settings']>) => {
    const newData = {
      ...data,
      settings: {
        ...data.settings,
        ...settings
      }
    };
    saveData(newData);
  };

  const createArticle = (article: Omit<BlogArticle, 'id' | 'publishedAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newArticle: BlogArticle = {
      ...article,
      id: Date.now().toString(),
      publishedAt: article.status === 'published' ? now : '',
      updatedAt: now
    };

    const newData = {
      ...data,
      articles: [newArticle, ...data.articles]
    };
    saveData(newData);
  };

  const updateArticle = (id: string, article: Partial<BlogArticle>) => {
    const now = new Date().toISOString();
    const newData = {
      ...data,
      articles: data.articles.map(a => 
        a.id === id 
          ? { 
              ...a, 
              ...article, 
              updatedAt: now,
              publishedAt: article.status === 'published' && !a.publishedAt ? now : a.publishedAt
            }
          : a
      )
    };
    saveData(newData);
  };

  const deleteArticle = (id: string) => {
    const newData = {
      ...data,
      articles: data.articles.filter(a => a.id !== id)
    };
    saveData(newData);
  };

  const getArticleBySlug = (slug: string): BlogArticle | undefined => {
    return data.articles.find(article => article.slug === slug);
  };

  const getPublishedArticles = (): BlogArticle[] => {
    return data.articles
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  };

  return (
    <CMSContext.Provider value={{
      data,
      isLoggedIn,
      login,
      logout,
      updatePage,
      updateNavigation,
      updateFooter,
      updateHomepage,
      updateCalculator,
      updateSettings,
      createArticle,
      updateArticle,
      deleteArticle,
      getArticleBySlug,
      getPublishedArticles
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}