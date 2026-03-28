import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";  
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import Closures from "./pages/Closures.tsx";
import ClosureOverview from "./pages/ClosureOverview.tsx";
import ClosureDetails from "./pages/ClosureDetails.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/*<Sonner />*/}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/closures" element={<Closures />} />
          <Route path="/closure-overview/:id" element={<ClosureOverview />} />
          <Route path="/closure-details/:id" element={<ClosureDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;