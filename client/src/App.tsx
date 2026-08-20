import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import NotFound from "@/pages/not-found";
import Discussions from "@/pages/Discussions";

function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (error && !isAuthenticated) {
    console.log('Authentication error:', error);
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </>
      ) : (
        <>
          {user?.role === "teacher" ? (
            <Route path="/" component={TeacherDashboard} />
          ) : (
            <Route path="/" component={StudentDashboard} />
          )}
          <Route path="/discussions" component={Discussions} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
