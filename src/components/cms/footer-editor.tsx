import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { useCMS, NavigationItem } from './cms-context';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FooterEditorProps {
  onBack: () => void;
}

export function FooterEditor({ onBack }: FooterEditorProps) {
  const { data, updateFooter } = useCMS();
  const [footer, setFooter] = useState(data.footer);

  const handleSave = () => {
    updateFooter(footer);
    toast.success('Footer updated successfully!');
    onBack();
  };

  const addLinkSection = () => {
    setFooter({
      ...footer,
      links: [
        ...footer.links,
        { title: 'New Section', items: [] }
      ]
    });
  };

  const updateLinkSection = (index: number, title: string) => {
    const newLinks = [...footer.links];
    newLinks[index].title = title;
    setFooter({
      ...footer,
      links: newLinks
    });
  };

  const removeLinkSection = (index: number) => {
    const newLinks = footer.links.filter((_, i) => i !== index);
    setFooter({
      ...footer,
      links: newLinks
    });
  };

  const addLinkItem = (sectionIndex: number) => {
    const newLinks = [...footer.links];
    newLinks[sectionIndex].items.push({ label: 'New Link', href: '/' });
    setFooter({
      ...footer,
      links: newLinks
    });
  };

  const updateLinkItem = (sectionIndex: number, itemIndex: number, item: NavigationItem) => {
    const newLinks = [...footer.links];
    newLinks[sectionIndex].items[itemIndex] = item;
    setFooter({
      ...footer,
      links: newLinks
    });
  };

  const removeLinkItem = (sectionIndex: number, itemIndex: number) => {
    const newLinks = [...footer.links];
    newLinks[sectionIndex].items = newLinks[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setFooter({
      ...footer,
      links: newLinks
    });
  };

  const addSocialLink = () => {
    setFooter({
      ...footer,
      social: [
        ...footer.social,
        { platform: 'New Platform', url: 'https://', icon: 'Link' }
      ]
    });
  };

  const updateSocialLink = (index: number, social: any) => {
    const newSocial = [...footer.social];
    newSocial[index] = social;
    setFooter({
      ...footer,
      social: newSocial
    });
  };

  const removeSocialLink = (index: number) => {
    const newSocial = footer.social.filter((_, i) => i !== index);
    setFooter({
      ...footer,
      social: newSocial
    });
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
          <h1 className="text-2xl font-bold">Footer Editor</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your footer content and links
          </p>
        </div>
      </div>

      {/* Company Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic company details displayed in footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={footer.companyInfo.name}
                onChange={(e) => setFooter({
                  ...footer,
                  companyInfo: { ...footer.companyInfo, name: e.target.value }
                })}
                placeholder="Your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDescription">Description</Label>
              <Textarea
                id="companyDescription"
                value={footer.companyInfo.description}
                onChange={(e) => setFooter({
                  ...footer,
                  companyInfo: { ...footer.companyInfo, description: e.target.value }
                })}
                placeholder="Brief company description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={footer.companyInfo.copyright}
                onChange={(e) => setFooter({
                  ...footer,
                  companyInfo: { ...footer.companyInfo, copyright: e.target.value }
                })}
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Contact details for your footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={footer.contact.email}
                  onChange={(e) => setFooter({
                    ...footer,
                    contact: { ...footer.contact, email: e.target.value }
                  })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={footer.contact.phone}
                  onChange={(e) => setFooter({
                    ...footer,
                    contact: { ...footer.contact, phone: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={footer.contact.address}
                onChange={(e) => setFooter({
                  ...footer,
                  contact: { ...footer.contact, address: e.target.value }
                })}
                placeholder="123 Main Street, City, State 12345"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Link Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Footer Link Sections</CardTitle>
              <CardDescription>Organize footer links into sections</CardDescription>
            </div>
            <Button onClick={addLinkSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {footer.links.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateLinkSection(sectionIndex, e.target.value)}
                        placeholder="Section title"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addLinkItem(sectionIndex)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLinkSection(sectionIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Links in this section */}
                  <div className="ml-8 space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Link Label</Label>
                            <Input
                              size="sm"
                              value={item.label}
                              onChange={(e) => updateLinkItem(sectionIndex, itemIndex, { ...item, label: e.target.value })}
                              placeholder="Link text"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Link URL</Label>
                            <Input
                              size="sm"
                              value={item.href}
                              onChange={(e) => updateLinkItem(sectionIndex, itemIndex, { ...item, href: e.target.value })}
                              placeholder="/page-url"
                            />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLinkItem(sectionIndex, itemIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add social media profiles</CardDescription>
            </div>
            <Button onClick={addSocialLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {footer.social.map((social, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Platform</Label>
                      <Input
                        value={social.platform}
                        onChange={(e) => updateSocialLink(index, { ...social, platform: e.target.value })}
                        placeholder="Twitter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">URL</Label>
                      <Input
                        value={social.url}
                        onChange={(e) => updateSocialLink(index, { ...social, url: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Icon</Label>
                      <Input
                        value={social.icon}
                        onChange={(e) => updateSocialLink(index, { ...social, icon: e.target.value })}
                        placeholder="Twitter"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
          Save Footer
        </Button>
      </div>
    </div>
  );
}