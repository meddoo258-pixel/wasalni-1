import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import DriverRegistration from "./pages/DriverRegistration";
import CoverageMap from "./pages/CoverageMap";
import AdminDashboard from "./pages/AdminDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import VehicleRental from "./pages/VehicleRental";
import Corporate from "./pages/Corporate";
import Subscribe from "./pages/Subscribe";
import InstallPWA from "./components/InstallPWA";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/services"} component={Services} />
        <Route path={"/pricing"} component={Pricing} />
        <Route path={"/about"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/drivers"} component={DriverRegistration} />
        <Route path={"/rental"} component={VehicleRental} />
        <Route path={"/corporate"} component={Corporate} />
        <Route path={"/subscribe"} component={Subscribe} />
        <Route path={"/coverage"} component={CoverageMap} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/passenger"} component={PassengerDashboard} />
        <Route path={"/driver"} component={DriverDashboard} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <InstallPWA />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
