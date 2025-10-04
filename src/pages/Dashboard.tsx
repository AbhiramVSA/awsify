import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { BookOpen, Plus, BarChart3, TrendingUp } from "lucide-react";

interface Stats {
  totalQuestions: number;
  categories: { category: string; count: number }[];
  difficulties: { difficulty: string; count: number }[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    categories: [],
    difficulties: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats(user.id);
    }
  }, [user]);

  const fetchStats = async (userId: string) => {
    try {
      // Get total questions
      const { data: questions, error } = await supabase
        .from("mcq_questions")
        .select("category, difficulty")
        .eq("user_id", userId);

      if (error) throw error;

      if (questions) {
        // Calculate statistics
        const categoryMap = new Map<string, number>();
        const difficultyMap = new Map<string, number>();

        questions.forEach((q) => {
          categoryMap.set(q.category, (categoryMap.get(q.category) || 0) + 1);
          difficultyMap.set(q.difficulty, (difficultyMap.get(q.difficulty) || 0) + 1);
        });

        setStats({
          totalQuestions: questions.length,
          categories: Array.from(categoryMap.entries()).map(([category, count]) => ({
            category,
            count,
          })),
          difficulties: Array.from(difficultyMap.entries()).map(([difficulty, count]) => ({
            difficulty,
            count,
          })),
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to AWS Exam Practice Portal</h1>
        <p className="text-secondary-foreground/90 text-lg">
          Master your AWS Cloud Architecting and Solutions Architect certification with targeted practice questions.
        </p>
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => navigate("/quiz")}
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Start Practice Quiz
          </Button>
          <Button
            onClick={() => navigate("/add")}
            size="lg"
            variant="outline"
            className="border-secondary-foreground/20 hover:bg-secondary-foreground/10"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Questions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Questions */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : stats.totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Questions in your database
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {loading ? "..." : stats.categories.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Different AWS service categories
            </p>
          </CardContent>
        </Card>

        {/* Difficulty Levels */}
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Levels</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {loading ? (
                <div className="text-sm">Loading...</div>
              ) : (
                stats.difficulties.map((d) => (
                  <div key={d.difficulty} className="flex justify-between text-sm">
                    <span className="capitalize">{d.difficulty}:</span>
                    <span className="font-semibold">{d.count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      {!loading && stats.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions by Category</CardTitle>
            <CardDescription>Overview of your question distribution across AWS services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.categories.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-primary font-bold text-lg">{cat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {stats.totalQuestions === 0 && !loading && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>No questions yet. Add your first question to begin practicing!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/add")}
              className="w-full bg-primary hover:bg-primary-hover"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Question
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
