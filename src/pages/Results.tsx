import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 0, percentage = 0 } = location.state || {};

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", color: "text-success", emoji: "🎉" };
    if (percentage >= 75) return { message: "Great Job!", color: "text-primary", emoji: "👏" };
    if (percentage >= 60) return { message: "Good Effort!", color: "text-accent", emoji: "👍" };
    if (percentage >= 50) return { message: "Keep Practicing!", color: "text-warning", emoji: "💪" };
    return { message: "Need More Practice", color: "text-destructive", emoji: "📚" };
  };

  const performance = getPerformanceMessage();

  if (!location.state) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>No Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't completed a quiz yet. Start a practice quiz to see your results here.
            </p>
            <Button onClick={() => navigate("/quiz")} className="bg-primary hover:bg-primary-hover">
              Start Practice Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-muted-foreground">Here's how you performed</p>
      </div>

      {/* Score Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center">Your Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            {/* Score Circle */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">{percentage}%</span>
              </div>
            </div>

            {/* Performance Message */}
            <div>
              <p className={cn("text-2xl font-bold mb-1", performance.color)}>
                {performance.emoji} {performance.message}
              </p>
              <p className="text-muted-foreground">
                You got <span className="font-bold text-foreground">{score}</span> out of{" "}
                <span className="font-bold text-foreground">{total}</span> questions correct
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-success">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
                <p className="text-2xl font-bold text-destructive">{total - score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => navigate("/quiz")}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Try Another Quiz
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Results;
