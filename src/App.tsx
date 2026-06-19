import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Closures from "./pages/Closures.tsx";
import ClosureOverview from "./pages/ClosureOverview.tsx";
import ClosureDetails from "./pages/ClosureDetails.tsx";
import CreateService from "./pages/CreateService.tsx";
import EditService from "./pages/EditService.tsx";
import NotFound from "./pages/NotFound.tsx";
import Categories from "./pages/Categories.tsx";
import Clients from "./pages/Clients.tsx";
import { AppHeader } from "./components/AppHeader";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppHeader />
            <Routes>
            <Route path="/login" element={<Login />} />
          
            <Route path="/" element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
              } />
            <Route path="/closures" element={
              <PrivateRoute>
                <Closures />
              </PrivateRoute>
              } />
            <Route path="/closure-overview/:id" element={
              <PrivateRoute>
                <ClosureOverview />
              </PrivateRoute>
              } />
            <Route path="/closure-details/:id" element={
              <PrivateRoute>
                <ClosureDetails />
              </PrivateRoute>
              } />
            <Route path="/create-service" element={
              <PrivateRoute>
                <CreateService />
              </PrivateRoute>
              } />
            <Route path="/edit-service/:id" element={
              <PrivateRoute>
                <EditService />
              </PrivateRoute>
              } />
            <Route path="/categories" element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
              } />
            <Route path="/clients" element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
              } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton={false} />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;