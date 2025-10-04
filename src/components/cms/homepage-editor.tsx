import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useCMS } from './cms-context';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HomepageEditorProps {
  onBack: () => void;
}

export function HomepageEditor({ onBack }: HomepageEditorProps) {
  const { data, updateHomepage } = useCMS();
  const [homepage, setHomepage] = useState(data.homepage);

  const handleSave = () => {
    updateHomepage(homepage);
    toast.success('Homepage updated successfully!');
    onBack();
  };

  const addFeature = () => {
    setHomepage({
      ...homepage,
      features: {
        ...homepage.features,
        items: [
          ...homepage.features.items,
          { title: 'New Feature', description: 'Feature description', icon: 'Star' }
        ]
      }
    });
  };

  const updateFeature = (index: number, feature: any) => {
    const newFeatures = [...homepage.features.items];
    newFeatures[index] = feature;
    setHomepage({
      ...homepage,
      features: {
        ...homepage.features,
        items: newFeatures
      }
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = homepage.features.items.filter((_, i) => i !== index);
    setHomepage({
      ...homepage,
      features: {
        ...homepage.features,
        items: newFeatures
      }
    });
  };

  const addCalculator = () => {
    setHomepage({
      ...homepage,
      calculators: {
        ...homepage.calculators,
        featured: [
          ...homepage.calculators.featured,
          { title: 'New Calculator', description: 'Calculator description', href: '/', icon: 'Calculator' }
        ]
      }
    });
  };

  const updateCalculator = (index: number, calculator: any) => {
    const newCalculators = [...homepage.calculators.featured];
    newCalculators[index] = calculator;
    setHomepage({
      ...homepage,
      calculators: {
        ...homepage.calculators,
        featured: newCalculators
      }
    });
  };

  const removeCalculator = (index: number) => {
    const newCalculators = homepage.calculators.featured.filter((_, i) => i !== index);
    setHomepage({
      ...homepage,
      calculators: {
        ...homepage.calculators,
        featured: newCalculators
      }
    });
  };

  const addTestimonial = () => {
    setHomepage({
      ...homepage,
      testimonials: {
        ...homepage.testimonials,
        items: [
          ...homepage.testimonials.items,
          { name: 'New User', role: 'Student', content: 'Great platform!', rating: 5 }
        ]
      }
    });
  };

  const updateTestimonial = (index: number, testimonial: any) => {
    const newTestimonials = [...homepage.testimonials.items];
    newTestimonials[index] = testimonial;
    setHomepage({
      ...homepage,
      testimonials: {
        ...homepage.testimonials,
        items: newTestimonials
      }
    });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = homepage.testimonials.items.filter((_, i) => i !== index);
    setHomepage({
      ...homepage,
      testimonials: {
        ...homepage.testimonials,
        items: newTestimonials
      }
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
          <h1 className="text-2xl font-bold">Homepage Editor</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your homepage content and sections
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="calculators">Calculators</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="cta">Call to Action</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main banner content that visitors see first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Main Title</Label>
                  <Input
                    id="heroTitle"
                    value={homepage.hero.title}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, title: e.target.value }
                    })}
                    placeholder="Master Your Academic Success"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={homepage.hero.subtitle}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, subtitle: e.target.value }
                    })}
                    placeholder="The Most Advanced GPA Calculator Platform"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroDescription">Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={homepage.hero.description}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, description: e.target.value }
                    })}
                    placeholder="Brief description of your platform"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryButton">Primary Button Text</Label>
                    <Input
                      id="primaryButton"
                      value={homepage.hero.primaryButton}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, primaryButton: e.target.value }
                      })}
                      placeholder="Start Calculating"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryButton">Secondary Button Text</Label>
                    <Input
                      id="secondaryButton"
                      value={homepage.hero.secondaryButton}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, secondaryButton: e.target.value }
                      })}
                      placeholder="Learn More"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Features Section</CardTitle>
                  <CardDescription>Highlight your platform's key features</CardDescription>
                </div>
                <Button onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuresTitle">Section Title</Label>
                    <Input
                      id="featuresTitle"
                      value={homepage.features.title}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        features: { ...homepage.features, title: e.target.value }
                      })}
                      placeholder="Everything You Need for Academic Success"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuresSubtitle">Section Subtitle</Label>
                    <Input
                      id="featuresSubtitle"
                      value={homepage.features.subtitle}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        features: { ...homepage.features, subtitle: e.target.value }
                      })}
                      placeholder="Powerful tools designed with students in mind"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Feature Items</h4>
                  {homepage.features.items.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Feature #{index + 1}</h5>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => updateFeature(index, { ...feature, title: e.target.value })}
                            placeholder="Feature title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Input
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, { ...feature, icon: e.target.value })}
                            placeholder="Calculator"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, { ...feature, description: e.target.value })}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Calculators Section */}
        <TabsContent value="calculators">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Featured Calculators</CardTitle>
                  <CardDescription>Showcase your main calculator tools</CardDescription>
                </div>
                <Button onClick={addCalculator}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Calculator
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calculatorsTitle">Section Title</Label>
                    <Input
                      id="calculatorsTitle"
                      value={homepage.calculators.title}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        calculators: { ...homepage.calculators, title: e.target.value }
                      })}
                      placeholder="Choose Your Calculator"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calculatorsSubtitle">Section Subtitle</Label>
                    <Input
                      id="calculatorsSubtitle"
                      value={homepage.calculators.subtitle}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        calculators: { ...homepage.calculators, subtitle: e.target.value }
                      })}
                      placeholder="Select the perfect tool for your academic level"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Featured Calculator Items</h4>
                  {homepage.calculators.featured.map((calculator, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Calculator #{index + 1}</h5>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCalculator(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={calculator.title}
                            onChange={(e) => updateCalculator(index, { ...calculator, title: e.target.value })}
                            placeholder="College GPA Calculator"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL</Label>
                          <Input
                            value={calculator.href}
                            onChange={(e) => updateCalculator(index, { ...calculator, href: e.target.value })}
                            placeholder="/calculators/college-gpa"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Input
                            value={calculator.icon}
                            onChange={(e) => updateCalculator(index, { ...calculator, icon: e.target.value })}
                            placeholder="GraduationCap"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={calculator.description}
                            onChange={(e) => updateCalculator(index, { ...calculator, description: e.target.value })}
                            placeholder="Calculator description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>Social proof from satisfied users</CardDescription>
                </div>
                <Button onClick={addTestimonial}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testimonialsTitle">Section Title</Label>
                    <Input
                      id="testimonialsTitle"
                      value={homepage.testimonials.title}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        testimonials: { ...homepage.testimonials, title: e.target.value }
                      })}
                      placeholder="Trusted by Students Worldwide"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonialsSubtitle">Section Subtitle</Label>
                    <Input
                      id="testimonialsSubtitle"
                      value={homepage.testimonials.subtitle}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        testimonials: { ...homepage.testimonials, subtitle: e.target.value }
                      })}
                      placeholder="See what students are saying about our platform"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Testimonial Items</h4>
                  {homepage.testimonials.items.map((testimonial, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Testimonial #{index + 1}</h5>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTestimonial(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={testimonial.name}
                            onChange={(e) => updateTestimonial(index, { ...testimonial, name: e.target.value })}
                            placeholder="Sarah Johnson"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input
                            value={testimonial.role}
                            onChange={(e) => updateTestimonial(index, { ...testimonial, role: e.target.value })}
                            placeholder="College Student"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => updateTestimonial(index, { ...testimonial, rating: parseInt(e.target.value) || 5 })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Testimonial Content</Label>
                        <Textarea
                          value={testimonial.content}
                          onChange={(e) => updateTestimonial(index, { ...testimonial, content: e.target.value })}
                          placeholder="This platform helped me track my GPA and plan my course load effectively..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Call to Action Section */}
        <TabsContent value="cta">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Call to Action</CardTitle>
                <CardDescription>Final call to action at the bottom of homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaTitle">CTA Title</Label>
                  <Input
                    id="ctaTitle"
                    value={homepage.cta.title}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      cta: { ...homepage.cta, title: e.target.value }
                    })}
                    placeholder="Ready to Take Control of Your Academic Success?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaDescription">CTA Description</Label>
                  <Textarea
                    id="ctaDescription"
                    value={homepage.cta.description}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      cta: { ...homepage.cta, description: e.target.value }
                    })}
                    placeholder="Join thousands of students who are already using our tools..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaButtonText">Button Text</Label>
                  <Input
                    id="ctaButtonText"
                    value={homepage.cta.buttonText}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      cta: { ...homepage.cta, buttonText: e.target.value }
                    })}
                    placeholder="Start Your Journey"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Homepage
        </Button>
      </div>
    </div>
  );
}