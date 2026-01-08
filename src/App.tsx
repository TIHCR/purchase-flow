import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import SolicitarCompra from "./pages/SolicitarCompra";
import AprovarSolicitacoes from "./pages/AprovarSolicitacoes";
import OrdemCompra from "./pages/OrdemCompra";
import OrdensCompra from "./pages/OrdensCompra";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<SolicitarCompra />} />
            <Route path="/aprovar" element={<AprovarSolicitacoes />} />
            <Route path="/ordens" element={<OrdensCompra />} />
            <Route path="/ordem/:id" element={<OrdemCompra />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
