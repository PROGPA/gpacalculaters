import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useCMS } from './cms-context';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CalculatorEditorProps {
  onBack: () => void;
  calculatorId: string;
}

export function CalculatorEditor({ onBack, calculatorId }: CalculatorEditorProps) {
  const { data, updateCalculator } = useCMS();
  const [calculator, setCalculator] = useState(data.calculators[calculatorId]);

  if (!calculator) {
    return (
      <div className="text-center py-8">
        <p>Calculator not found</p>
        <Button onClick={onBack} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const handleSave = () => {
    updateCalculator(calculatorId, calculator);
    toast.success('Calculator updated successfully!');
    onBack();
  };

  const addFeature = () => {
    setCalculator({
      ...calculator,
      features: [...calculator.features, 'New feature']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...calculator.features];
    newFeatures[index] = value;
    setCalculator({
      ...calculator,
      features: newFeatures
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = calculator.features.filter((_, i) => i !== index);
    setCalculator({
      ...calculator,
      features: newFeatures
    });
  };

  const addTip = () => {
    setCalculator({
      ...calculator,
      tips: [...calculator.tips, 'New tip']
    });
  };

  const updateTip = (index: number, value: string) => {
    const newTips = [...calculator.tips];
    newTips[index] = value;
    setCalculator({
      ...calculator,
      tips: newTips
    });
  };

  const removeTip = (index: number) => {
    const newTips = calculator.tips.filter((_, i) => i !== index);
    setCalculator({
      ...calculator,
      tips: newTips
    });
  };

  const addSuccessMessage = () => {
    setCalculator({
      ...calculator,
      successMessages: [...calculator.successMessages, 'Great job!']
    });
  };

  const updateSuccessMessage = (index: number, value: string) => {
    const newMessages = [...calculator.successMessages];
    newMessages[index] = value;
    setCalculator({
      ...calculator,
      successMessages: newMessages
    });
  };

  const removeSuccessMessage = (index: number) => {
    const newMessages = calculator.successMessages.filter((_, i) => i !== index);
    setCalculator({
      ...calculator,
      successMessages: newMessages
    });
  };

  const updatePlaceholder = (key: string, value: string) => {
    setCalculator({
      ...calculator,
      placeholders: {
        ...calculator.placeholders,
        [key]: value
      }
    });
  };

  const updateLabel = (key: string, value: string) => {
    setCalculator({
      ...calculator,
      labels: {
        ...calculator.labels,
        [key]: value
      }
    });
  };

  const updateHelpText = (key: string, value: string) => {
    setCalculator({
      ...calculator,
      helpTexts: {
        ...calculator.helpTexts,
        [key]: value
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
          <h1 className="text-2xl font-bold">Calculator Editor</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Editing: {calculator.title}
          </p>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core calculator details and descriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Calculator Title</Label>
                  <Input
                    id="title"
                    value={calculator.title}
                    onChange={(e) => setCalculator({ ...calculator, title: e.target.value })}
                    placeholder="College GPA Calculator"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={calculator.subtitle}
                    onChange={(e) => setCalculator({ ...calculator, subtitle: e.target.value })}
                    placeholder="Advanced GPA calculation for college students"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={calculator.description}
                    onChange={(e) => setCalculator({ ...calculator, description: e.target.value })}
                    placeholder="Detailed description of the calculator"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Primary Button Text</Label>
                  <Input
                    id="buttonText"
                    value={calculator.buttonText}
                    onChange={(e) => setCalculator({ ...calculator, buttonText: e.target.value })}
                    placeholder="Calculate GPA"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Calculator Features</CardTitle>
                  <CardDescription>List of calculator capabilities and features</CardDescription>
                </div>
                <Button onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculator.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Feature description"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Interface Elements */}
        <TabsContent value="interface">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Placeholders */}
              <Card>
                <CardHeader>
                  <CardTitle>Placeholders</CardTitle>
                  <CardDescription>Input field placeholder text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculator.placeholders).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updatePlaceholder(key, e.target.value)}
                        placeholder={`Placeholder for ${key}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Labels */}
              <Card>
                <CardHeader>
                  <CardTitle>Field Labels</CardTitle>
                  <CardDescription>Labels for form fields</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculator.labels).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateLabel(key, e.target.value)}
                        placeholder={`Label for ${key}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Help Texts */}
              <Card>
                <CardHeader>
                  <CardTitle>Help Texts</CardTitle>
                  <CardDescription>Helpful explanations for users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculator.helpTexts).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Textarea
                        value={value}
                        onChange={(e) => updateHelpText(key, e.target.value)}
                        placeholder={`Help text for ${key}`}
                        rows={2}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Success Messages */}
        <TabsContent value="messages">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Success Messages</CardTitle>
                  <CardDescription>Encouraging messages shown after calculations</CardDescription>
                </div>
                <Button onClick={addSuccessMessage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Message
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculator.successMessages.map((message, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          value={message}
                          onChange={(e) => updateSuccessMessage(index, e.target.value)}
                          placeholder="Encouraging success message"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSuccessMessage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Study Tips */}
        <TabsContent value="tips">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Study Tips</CardTitle>
                  <CardDescription>Helpful academic advice for students</CardDescription>
                </div>
                <Button onClick={addTip}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tip
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculator.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-1">
                        <Textarea
                          value={tip}
                          onChange={(e) => updateTip(index, e.target.value)}
                          placeholder="Helpful study tip or academic advice"
                          rows={2}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTip(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
          Save Calculator
        </Button>
      </div>
    </div>
  );
}