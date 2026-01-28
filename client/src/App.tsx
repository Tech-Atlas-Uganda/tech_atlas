import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Ecosystem from "./pages/Ecosystem";
import Jobs from "./pages/Jobs";
import Learning from "./pages/Learning";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import SubmitHub from "./pages/SubmitHub";
import SubmitJob from "./pages/SubmitJob";
import SubmitEvent from "./pages/SubmitEvent";
import SubmitResource from "./pages/SubmitResource";
import SubmitBlog from "./pages/SubmitBlog";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/ecosystem" component={Ecosystem} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/learning" component={Learning} />
          <Route path="/events" component={Events} />
          <Route path="/blog" component={Blog} />
          <Route path="/admin" component={Admin} />
          <Route path="/submit/hub" component={SubmitHub} />
          <Route path="/submit/job" component={SubmitJob} />
          <Route path="/submit/event" component={SubmitEvent} />
          <Route path="/submit/resource" component={SubmitResource} />
          <Route path="/submit/blog" component={SubmitBlog} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
