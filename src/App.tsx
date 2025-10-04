import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddQuestions from "./pages/AddQuestions";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddQuestions />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const UnauthenticatedApp = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = () => {
  const { user, loading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {loading ? (
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : user ? (
            <AuthenticatedApp />
          ) : (
            <UnauthenticatedApp />
          )}
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
