import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Upload, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const AddQuestions = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Manual form state
  const [formData, setFormData] = useState({
    service_name: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_answer: "",
    category: "",
    difficulty: "easy",
    explanation: "",
  });

  // Bulk upload state
  const [bulkJson, setBulkJson] = useState("");

  const resetForm = () => {
    setFormData({
      service_name: "",
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct_answer: "",
      category: "",
      difficulty: "easy",
      explanation: "",
    });
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to add questions");
      return;
    }
    
    // Validation
    const options = [formData.option1, formData.option2, formData.option3, formData.option4];
    if (options.some(opt => !opt.trim())) {
      toast.error("All 4 options are required");
      return;
    }
    
    if (!options.includes(formData.correct_answer)) {
      toast.error("Correct answer must match one of the options");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("mcq_questions").insert({
        service_name: formData.service_name,
        question: formData.question,
        options: options,
        correct_answer: formData.correct_answer,
        category: formData.category,
        difficulty: formData.difficulty,
        explanation: formData.explanation,
        user_id: user.id,
        is_global: false,
      });

      if (error) throw error;

      toast.success("Question added successfully!", {
        icon: <CheckCircle2 className="text-success" />,
      });
      resetForm();
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("Please sign in to upload questions");
      }
      const data = JSON.parse(bulkJson);
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid JSON format. Expected { questions: [...] }");
      }

      // Validate each question
      const validatedQuestions = data.questions.map((q: any) => {
        if (!q.service_name || !q.question || !Array.isArray(q.options) || 
            q.options.length !== 4 || !q.correct_answer || !q.category || 
            !q.difficulty || !q.explanation) {
          throw new Error("Each question must have all required fields");
        }
        return {
          service_name: q.service_name,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          category: q.category,
          difficulty: q.difficulty,
          explanation: q.explanation,
          user_id: user.id,
          is_global: false,
        };
      });

      const { error } = await supabase
        .from("mcq_questions")
        .insert(validatedQuestions);

      if (error) throw error;

      toast.success(`${validatedQuestions.length} questions added successfully!`, {
        icon: <CheckCircle2 className="text-success" />,
      });
      setBulkJson("");
    } catch (error: any) {
      console.error("Error in bulk upload:", error);
      toast.error(error.message || "Failed to upload questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add Questions</h1>
        <p className="text-muted-foreground">Add questions manually or upload in bulk using JSON format</p>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <Plus className="w-4 h-4 mr-2" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Add Single Question</CardTitle>
              <CardDescription>Fill in the form to add a new MCQ question</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service_name">AWS Service Name</Label>
                    <Input
                      id="service_name"
                      placeholder="e.g., Amazon EC2"
                      value={formData.service_name}
                      onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Compute, Storage"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Options (4 required)</Label>
                  {[1, 2, 3, 4].map((num) => (
                    <Input
                      key={num}
                      placeholder={`Option ${num}`}
                      value={formData[`option${num}` as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                      required
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correct_answer">Correct Answer</Label>
                    <Input
                      id="correct_answer"
                      placeholder="Must match one of the options above"
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain why this is the correct answer..."
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover">
                  {loading ? "Adding..." : "Add Question"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Questions</CardTitle>
              <CardDescription>
                Paste JSON data in the format: {`{ "questions": [...] }`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-json">JSON Data</Label>
                <Textarea
                  id="bulk-json"
                  placeholder={`{
  "questions": [
    {
      "service_name": "Amazon EC2",
      "question": "Which AWS service provides...",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Option 2",
      "category": "Compute",
      "difficulty": "easy",
      "explanation": "Explanation here..."
    }
  ]
}`}
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <Button
                onClick={handleBulkUpload}
                disabled={loading || !bulkJson.trim()}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                {loading ? "Uploading..." : "Upload Questions"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddQuestions;
