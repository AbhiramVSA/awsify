import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

interface Question {
  id: string;
  service_name: string;
  question: string;
  options: string[];
  correct_answer: string;
  category: string;
  difficulty: string;
  explanation: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<string>("10");
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCategories(user.id);
    }
  }, [user]);

  const fetchCategories = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("mcq_questions")
        .select("category")
        .eq("user_id", userId);
      
      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(q => q.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const startQuiz = async () => {
    if (!user) {
      toast.error("Please sign in to start a quiz");
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from("mcq_questions").select("*").eq("user_id", user.id);
      
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      
      if (selectedDifficulty !== "all") {
        query = query.eq("difficulty", selectedDifficulty);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error("No questions found with selected filters");
        return;
      }
      
      // Shuffle and limit questions
      const shuffled = data.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, parseInt(questionCount));
      
      setQuestions(limited);
      setQuizStarted(true);
      setCurrentIndex(0);
      setScore(0);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (answered) return;
    
    setSelectedAnswer(option);
    setAnswered(true);
    
    if (option === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Quiz completed
      navigate("/results", { 
        state: { 
          score, 
          total: questions.length,
          percentage: Math.round((score / questions.length) * 100)
        } 
      });
    }
  };

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Quiz</h1>
          <p className="text-muted-foreground">Configure your quiz settings and start practicing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
            <CardDescription>Select category, difficulty, and number of questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
              />
            </div>

            <Button
              onClick={startQuiz}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Start Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            Score: {score}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
              {currentQuestion.category}
            </span>
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded capitalize",
              currentQuestion.difficulty === "easy" && "text-success bg-success/10",
              currentQuestion.difficulty === "medium" && "text-warning bg-warning/10",
              currentQuestion.difficulty === "hard" && "text-destructive bg-destructive/10"
            )}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          <CardDescription className="text-sm">{currentQuestion.service_name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQuestion.correct_answer;
              const showCorrect = answered && isCorrectAnswer;
              const showIncorrect = answered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answered}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                    "hover:border-primary hover:bg-primary/5",
                    !answered && "border-border",
                    showCorrect && "border-success bg-success/10",
                    showIncorrect && "border-destructive bg-destructive/10",
                    isSelected && !answered && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                    {showIncorrect && <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className={cn(
              "p-4 rounded-lg border-2 animate-fade-in",
              isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
            )}>
              <div className="flex items-start gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div>
                  <p className="font-semibold mb-1">
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-sm text-foreground/90">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
