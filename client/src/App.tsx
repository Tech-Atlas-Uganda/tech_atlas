import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UgandaMap from "./pages/UgandaMap";
import Ecosystem from "./pages/Ecosystem";
import Jobs from "./pages/Jobs";
import Learning from "./pages/Learning";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Admin from "./pages/Admin";
import CoreAdmin from "./pages/CoreAdmin";
import Moderator from "./pages/Moderator";
import Editor from "./pages/Editor";
import SubmitHub from "./pages/SubmitHub";
import SubmitJob from "./pages/SubmitJob";
import SubmitGig from "./pages/SubmitGig";
import SubmitEvent from "./pages/SubmitEvent";
import SubmitResource from "./pages/SubmitResource";
import SubmitBlog from "./pages/SubmitBlog";
import ProfileSettings from "./pages/ProfileSettings";
import Team from "./pages/Team";
import Profiles from "./pages/Profiles";
import Contribute from "./pages/Contribute";
import Governance from "./pages/Governance";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CodeOfConduct from "./pages/CodeOfConduct";
import Support from "./pages/Support";
import Forum from "./pages/Forum";
import NewThread from "./pages/NewThread";
import ThreadDetail from "./pages/ThreadDetail";
import { AuthCallback } from "./pages/AuthCallback";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard">
            <Dashboard />
            <Footer />
          </Route>
          <Route path="/map">
            <UgandaMap />
            <Footer />
          </Route>
          <Route path="/ecosystem">
            <Ecosystem />
            <Footer />
          </Route>
          <Route path="/profiles">
            <Profiles />
            <Footer />
          </Route>
          <Route path="/jobs">
            <Jobs />
            <Footer />
          </Route>
          <Route path="/learning">
            <Learning />
            <Footer />
          </Route>
          <Route path="/events">
            <Events />
            <Footer />
          </Route>
          <Route path="/blog">
            <Blog />
            <Footer />
          </Route>
          <Route path="/blog/:slug">
            <BlogDetail />
            <Footer />
          </Route>
          <Route path="/admin">
            <Admin />
            <Footer />
          </Route>
          <Route path="/core-admin">
            <CoreAdmin />
            <Footer />
          </Route>
          <Route path="/moderator">
            <Moderator />
            <Footer />
          </Route>
          <Route path="/editor">
            <Editor />
            <Footer />
          </Route>
          <Route path="/submit/hub">
            <SubmitHub />
            <Footer />
          </Route>
          <Route path="/submit/job">
            <SubmitJob />
            <Footer />
          </Route>
          <Route path="/submit/gig">
            <SubmitGig />
            <Footer />
          </Route>
          <Route path="/submit/event">
            <SubmitEvent />
            <Footer />
          </Route>
          <Route path="/submit/resource">
            <SubmitResource />
            <Footer />
          </Route>
          <Route path="/submit/blog">
            <SubmitBlog />
            <Footer />
          </Route>
          <Route path="/profile/settings">
            <ProfileSettings />
            <Footer />
          </Route>
          <Route path="/team">
            <Team />
            <Footer />
          </Route>
          <Route path="/contribute">
            <Contribute />
            <Footer />
          </Route>
          <Route path="/governance">
            <Governance />
            <Footer />
          </Route>
          <Route path="/about">
            <About />
            <Footer />
          </Route>
          <Route path="/privacy">
            <Privacy />
            <Footer />
          </Route>
          <Route path="/terms">
            <Terms />
            <Footer />
          </Route>
          <Route path="/code-of-conduct">
            <CodeOfConduct />
            <Footer />
          </Route>
          <Route path="/support">
            <Support />
            <Footer />
          </Route>
          <Route path="/forum">
            <Forum />
            <Footer />
          </Route>
          <Route path="/forum/new">
            <NewThread />
            <Footer />
          </Route>
          <Route path="/forum/:slug">
            <ThreadDetail />
            <Footer />
          </Route>
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/404">
            <NotFound />
            <Footer />
          </Route>
          <Route>
            <NotFound />
            <Footer />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
