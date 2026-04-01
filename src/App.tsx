import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import Closures from "./pages/Closures.tsx";
import ClosureOverview from "./pages/ClosureOverview.tsx";
import ClosureDetails from "./pages/ClosureDetails.tsx";
import CreateService from "./pages/CreateService.tsx";
import EditService from "./pages/EditService.tsx";
import CreateCategory from "./pages/CreateCategory.tsx";
import EditCategory from "./pages/EditCategory.tsx";
import CreateClient from "./pages/CreateClient.tsx";
import EditClient from "./pages/EditClient.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppHeader } from "./components/AppHeader";


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
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />
          <Route path="/create-client" element={<CreateClient />} />
          <Route path="/edit-client/:id" element={<EditClient />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;