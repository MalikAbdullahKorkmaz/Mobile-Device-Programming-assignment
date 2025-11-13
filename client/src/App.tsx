import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudySessions from "./pages/StudySessions";
import Assignments from "./pages/Assignments";
import Statistics from "./pages/Statistics";
import StressLogging from "./pages/StressLogging";
import Quizzes from "./pages/Quizzes";
import Social from "./pages/Social";
import Leaderboard from "./pages/Leaderboard";
import DailySurvey from "./pages/DailySurvey";
import StudyMaterials from "./pages/StudyMaterials";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* Dashboard Routes */}
      <Route path={"/study-sessions"}>
        {() => (
          <DashboardLayout>
            <StudySessions />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path={"/assignments"}>
        {() => (
          <DashboardLayout>
            <Assignments />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/statistics"}>
        {() => (
          <DashboardLayout>
            <Statistics />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/stress-logging"}>
        {() => (
          <DashboardLayout>
            <StressLogging />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/quizzes"}>
        {() => (
          <DashboardLayout>
            <Quizzes />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/social"}>
        {() => (
          <DashboardLayout>
            <Social />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/leaderboard"}>
        {() => (
          <DashboardLayout>
            <Leaderboard />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/survey"}>
        {() => (
          <DashboardLayout>
            <DailySurvey />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/materials"}>
        {() => (
          <DashboardLayout>
            <StudyMaterials />
          </DashboardLayout>
        )}
      </Route>

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
