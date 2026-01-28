import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Ecosystem from "./pages/Ecosystem";
import Jobs from "./pages/Jobs";
import Learning from "./pages/Learning";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/ecosystem"} component={Ecosystem} />
      <Route path={"/jobs"} component={Jobs} />
      <Route path={"/learning"} component={Learning} />
      <Route path={"/events"} component={Events} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/admin"} component={Admin} />
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
        switchable
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
