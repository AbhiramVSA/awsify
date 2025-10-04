import { Link, useLocation } from "react-router-dom";
import { Home, Plus, BookOpen, Info, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/add", icon: Plus, label: "Add Questions" },
    { path: "/quiz", icon: BookOpen, label: "Practice Quiz" },
    { path: "/about", icon: Info, label: "About" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AWS Exam Practice Portal</h1>
                <p className="text-xs text-secondary-foreground/80">Master Your AWS Certification</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-secondary-foreground/80">Your personal workspace</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-background border-b border-border sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-secondary-foreground/80">
            <p>© 2025 AWS Exam Practice Portal. Built for AWS Cloud Architects.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
