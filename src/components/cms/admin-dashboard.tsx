import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArticleEditor } from './article-editor';
import { PageEditor } from './page-editor';
import { NavigationEditor } from './navigation-editor';
import { FooterEditor } from './footer-editor';
import { HomepageEditor } from './homepage-editor';
import { CalculatorEditor } from './calculator-editor';
import { SettingsEditor } from './settings-editor';
import { useCMS } from './cms-context';
import { 
  FileText, 
  Plus, 
  Edit,
  Globe,
  Navigation,
  Calculator,
  Home,
  Settings,
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';

export function AdminDashboard() {
  const { data, getPublishedArticles } = useCMS();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<{ type: string; id?: string } | null>(null);

  const publishedArticles = getPublishedArticles();
  const draftArticles = data.articles.filter(article => article.status === 'draft');

  const stats = [
    {
      title: 'Total Articles',
      value: data.articles.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: publishedArticles.length,
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Drafts',
      value: draftArticles.length,
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Calculators',
      value: Object.keys(data.calculators).length,
      icon: Calculator,
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'New Article',
      description: 'Create a new blog article',
      icon: Plus,
      action: () => setEditingItem({ type: 'article' }),
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Edit Homepage',
      description: 'Update homepage content',
      icon: Home,
      action: () => setEditingItem({ type: 'homepage' }),
      color: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Navigation Menu',
      description: 'Update site navigation',
      icon: Navigation,
      action: () => setEditingItem({ type: 'navigation' }),
      color: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Site Settings',
      description: 'Configure site preferences',
      icon: Settings,
      action: () => setEditingItem({ type: 'settings' }),
      color: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  if (editingItem) {
    switch (editingItem.type) {
      case 'article':
        return <ArticleEditor onBack={() => setEditingItem(null)} articleId={editingItem.id} />;
      case 'page':
        return <PageEditor onBack={() => setEditingItem(null)} pageId={editingItem.id!} />;
      case 'navigation':
        return <NavigationEditor onBack={() => setEditingItem(null)} />;
      case 'footer':
        return <FooterEditor onBack={() => setEditingItem(null)} />;
      case 'homepage':
        return <HomepageEditor onBack={() => setEditingItem(null)} />;
      case 'calculator':
        return <CalculatorEditor onBack={() => setEditingItem(null)} calculatorId={editingItem.id!} />;
      case 'settings':
        return <SettingsEditor onBack={() => setEditingItem(null)} />;
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage all aspects of your GPA Calculator Pro website
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${action.color}`}>
                <CardContent className="p-6" onClick={action.action}>
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-8 h-8" />
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{article.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem({ type: 'article', id: article.id })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Website Components */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Website Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Homepage', type: 'homepage', icon: Home },
                    { label: 'Navigation', type: 'navigation', icon: Navigation },
                    { label: 'Footer', type: 'footer', icon: Globe },
                    { label: 'About Page', type: 'page', id: 'about', icon: Users },
                    { label: 'Contact Page', type: 'page', id: 'contact', icon: FileText }
                  ].map((component) => (
                    <div key={component.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <component.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{component.label}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingItem({ type: component.type, id: component.id })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blog Articles</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </div>
              <Button onClick={() => setEditingItem({ type: 'article' })}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{article.title}</h4>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        By {article.author} • {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setEditingItem({ type: 'article', id: article.id })}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Static Pages</CardTitle>
              <CardDescription>Manage your website pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.pages).map(([pageId, page]) => (
                  <div key={pageId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setEditingItem({ type: 'page', id: pageId })}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculators">
          <Card>
            <CardHeader>
              <CardTitle>Calculator Pages</CardTitle>
              <CardDescription>Manage calculator content and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.calculators).map(([calculatorId, calculator]) => (
                  <div key={calculatorId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{calculator.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {calculator.subtitle}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Features: {calculator.features.length} • Tips: {calculator.tips.length}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setEditingItem({ type: 'calculator', id: calculatorId })}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Manage your site navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Logo & Branding</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.navigation.logo.text} - {data.navigation.logo.subtext}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Navigation Items</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.navigation.mainNavigation.length} main menu items
                  </p>
                </div>
                <Button onClick={() => setEditingItem({ type: 'navigation' })}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Navigation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
              <CardDescription>Manage footer links and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Company Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.footer.companyInfo.name}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Link Sections</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.footer.links.length} link sections
                  </p>
                </div>
                <Button onClick={() => setEditingItem({ type: 'footer' })}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Footer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure global site preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Site Name</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.settings.siteName}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Language</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.settings.language}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Primary Color</h4>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: data.settings.primaryColor }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {data.settings.primaryColor}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Timezone</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.settings.timezone}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setEditingItem({ type: 'settings' })}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}