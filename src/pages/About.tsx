import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Zap, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Question Bank",
      description: "Build your own custom question database covering all AWS services and exam topics."
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Filter questions by category and difficulty to focus on your weak areas."
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get immediate explanations for every question to reinforce learning."
    },
    {
      icon: Shield,
      title: "Exam Ready",
      description: "Practice with questions designed for AWS Cloud Architecting and Solutions Architect certification."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About AWS Exam Practice Portal</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal study companion for mastering AWS Cloud Architecting and Solutions Architect certification exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card key={idx} className="hover-scale">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Add Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Use the Add Questions page to input questions manually or upload them in bulk using JSON format.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Configure Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  Select your preferred category, difficulty level, and number of questions for targeted practice.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Practice & Learn</h3>
                <p className="text-sm text-muted-foreground">
                  Answer questions one at a time, get instant feedback, and review explanations to reinforce your knowledge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  View your results, identify weak areas, and track your improvement over time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground border-0">
        <CardContent className="py-6">
          <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
          <p className="text-secondary-foreground/90">
            Build your question bank and start practicing for your AWS certification exam today. Good luck! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
