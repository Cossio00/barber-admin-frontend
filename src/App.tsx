import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import Closures from "./pages/Closures.tsx";
import ClosureOverview from "./pages/ClosureOverview.tsx";
import ClosureDetails from "./pages/ClosureDetails.tsx";
import CreateService from "./pages/CreateService.tsx";
import EditService from "./pages/EditService.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppHeader } from "./components/AppHeader";
import Categories from "./pages/Categories.tsx";
import Clients from "./pages/Clients.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/closures" element={<Closures />} />
          <Route path="/closure-overview/:id" element={<ClosureOverview />} />
          <Route path="/closure-details/:id" element={<ClosureDetails />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/edit-service/:id" element={<EditService />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;