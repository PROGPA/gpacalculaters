import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useCMS, NavigationItem } from './cms-context';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface NavigationEditorProps {
  onBack: () => void;
}

export function NavigationEditor({ onBack }: NavigationEditorProps) {
  const { data, updateNavigation } = useCMS();
  const [navigation, setNavigation] = useState(data.navigation);

  const handleSave = () => {
    updateNavigation(navigation);
    toast.success('Navigation updated successfully!');
    onBack();
  };

  const addNavigationItem = () => {
    setNavigation({
      ...navigation,
      mainNavigation: [
        ...navigation.mainNavigation,
        { label: 'New Item', href: '/' }
      ]
    });
  };

  const updateNavigationItem = (index: number, item: NavigationItem) => {
    const newItems = [...navigation.mainNavigation];
    newItems[index] = item;
    setNavigation({
      ...navigation,
      mainNavigation: newItems
    });
  };

  const removeNavigationItem = (index: number) => {
    const newItems = navigation.mainNavigation.filter((_, i) => i !== index);
    setNavigation({
      ...navigation,
      mainNavigation: newItems
    });
  };

  const addSubItem = (parentIndex: number) => {
    const newItems = [...navigation.mainNavigation];
    if (!newItems[parentIndex].children) {
      newItems[parentIndex].children = [];
    }
    newItems[parentIndex].children!.push({ label: 'New Sub Item', href: '/' });
    setNavigation({
      ...navigation,
      mainNavigation: newItems
    });
  };

  const updateSubItem = (parentIndex: number, subIndex: number, item: NavigationItem) => {
    const newItems = [...navigation.mainNavigation];
    if (newItems[parentIndex].children) {
      newItems[parentIndex].children![subIndex] = item;
      setNavigation({
        ...navigation,
        mainNavigation: newItems
      });
    }
  };

  const removeSubItem = (parentIndex: number, subIndex: number) => {
    const newItems = [...navigation.mainNavigation];
    if (newItems[parentIndex].children) {
      newItems[parentIndex].children = newItems[parentIndex].children!.filter((_, i) => i !== subIndex);
      setNavigation({
        ...navigation,
        mainNavigation: newItems
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Navigation Editor</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your site navigation and branding
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Configure your site logo and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoText">Logo Text</Label>
                <Input
                  id="logoText"
                  value={navigation.logo.text}
                  onChange={(e) => setNavigation({
                    ...navigation,
                    logo: { ...navigation.logo, text: e.target.value }
                  })}
                  placeholder="Site name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoSubtext">Logo Subtext</Label>
                <Input
                  id="logoSubtext"
                  value={navigation.logo.subtext}
                  onChange={(e) => setNavigation({
                    ...navigation,
                    logo: { ...navigation.logo, subtext: e.target.value }
                  })}
                  placeholder="Tagline or description"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Auth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Authentication Buttons</CardTitle>
              <CardDescription>Configure login and signup button text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginText">Login Button Text</Label>
                <Input
                  id="loginText"
                  value={navigation.authButtons.login}
                  onChange={(e) => setNavigation({
                    ...navigation,
                    authButtons: { ...navigation.authButtons, login: e.target.value }
                  })}
                  placeholder="Log In"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupText">Signup Button Text</Label>
                <Input
                  id="signupText"
                  value={navigation.authButtons.signup}
                  onChange={(e) => setNavigation({
                    ...navigation,
                    authButtons: { ...navigation.authButtons, signup: e.target.value }
                  })}
                  placeholder="Sign Up"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Navigation Menu Items</CardTitle>
              <CardDescription>Manage your main navigation menu</CardDescription>
            </div>
            <Button onClick={addNavigationItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {navigation.mainNavigation.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateNavigationItem(index, { ...item, label: e.target.value })}
                          placeholder="Menu item label"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={item.href}
                          onChange={(e) => updateNavigationItem(index, { ...item, href: e.target.value })}
                          placeholder="/page-url"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSubItem(index)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeNavigationItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sub Items */}
                  {item.children && item.children.length > 0 && (
                    <div className="ml-8 space-y-3">
                      <Separator />
                      <h4 className="font-medium text-sm">Dropdown Items</h4>
                      {item.children.map((subItem, subIndex) => (
                        <div key={subIndex} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Sub Label</Label>
                              <Input
                                size="sm"
                                value={subItem.label}
                                onChange={(e) => updateSubItem(index, subIndex, { ...subItem, label: e.target.value })}
                                placeholder="Sub item label"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Sub URL</Label>
                              <Input
                                size="sm"
                                value={subItem.href}
                                onChange={(e) => updateSubItem(index, subIndex, { ...subItem, href: e.target.value })}
                                placeholder="/sub-page-url"
                              />
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSubItem(index, subIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Navigation
        </Button>
      </div>
    </div>
  );
}