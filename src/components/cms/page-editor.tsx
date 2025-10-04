import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { useCMS } from './cms-context';
import { ArrowLeft, Save, Globe, FileText, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PageEditorProps {
  pageId: string;
  onBack: () => void;
}

export function PageEditor({ pageId, onBack }: PageEditorProps) {
  const { data, updatePage } = useCMS();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    const page = data.pages[pageId];
    if (page) {
      setFormData({
        title: page.title,
        content: page.content,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || ''
      });
    }
  }, [pageId, data.pages]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);

    try {
      updatePage(pageId, {
        title: formData.title,
        content: formData.content,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription
      });

      // Simulate save time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Page updated successfully');
      onBack();
    } catch (error) {
      toast.error('Failed to update page');
    } finally {
      setIsSaving(false);
    }
  };

  const pageConfig = {
    about: {
      displayName: 'About Us',
      description: 'Information about GPA Calculator Pro',
      url: '/about'
    },
    contact: {
      displayName: 'Contact',
      description: 'Contact information and form',
      url: '/contact'
    },
    privacy: {
      displayName: 'Privacy Policy',
      description: 'Privacy policy and data handling',
      url: '/privacy'
    },
    terms: {
      displayName: 'Terms & Conditions',
      description: 'Terms of service and conditions',
      url: '/terms'
    }
  }[pageId] || { displayName: 'Page', description: 'Page content', url: `/${pageId}` };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pages
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Edit {pageConfig.displayName}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {pageConfig.description} • {pageConfig.url}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Page'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter page title..."
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your page content in Markdown format..."
                    rows={25}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Supports Markdown formatting. Use # for headings, **bold**, *italic*, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Page URL: {pageConfig.url}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Page Type:</strong> Static Page</p>
                  <p><strong>Last Updated:</strong> {new Date(data.pages[pageId]?.updatedAt || '').toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="SEO optimized title..."
                  />
                  <p className="text-xs text-gray-500">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Brief description for search engines..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <Separator />
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Current lengths:</strong></p>
                  <p>Title: {formData.seoTitle.length}/60 characters</p>
                  <p>Description: {formData.seoDescription.length}/160 characters</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Word count:</span>
                  <span>{formData.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Character count:</span>
                  <span>{formData.content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated read time:</span>
                  <span>{Math.max(1, Math.ceil(formData.content.split(/\s+/).length / 200))} min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formatting Help</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <div><code># Heading 1</code></div>
                <div><code>## Heading 2</code></div>
                <div><code>**Bold text**</code></div>
                <div><code>*Italic text*</code></div>
                <div><code>[Link](url)</code></div>
                <div><code>- List item</code></div>
                <div><code>---</code> for separator</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}