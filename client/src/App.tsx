import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Doctors from "@/pages/Doctors";
import PatientDashboard from "@/pages/PatientDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/contact" component={Contact} />
      
      {/* Protected Routes (Logic handled inside components for redirect) */}
      <Route path="/dashboard" component={PatientDashboard} />
      <Route path="/dashboard/:tab" component={PatientDashboard} />
      
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:tab" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
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
