import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Grimoires from "@/pages/grimoires";
import Courses from "@/pages/courses";
import Vip from "@/pages/vip";
import Secret from "@/pages/secret";
import Acesso from "@/pages/acesso";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/libri-umbrarum" component={Grimoires} />
      <Route path="/cursus-mysticus" component={Courses} />
      <Route path="/sanctum-vip" component={Vip} />
      <Route path="/arcana-secreta" component={Secret} />
      <Route path="/porta-templi" component={Acesso} />
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
