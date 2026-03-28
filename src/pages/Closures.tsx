import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data
const MOCK_CLOSURES = [
  { id: "1", month: 2, year: 2025, total: 4850.0, closedAt: "2025-03-01T10:00:00Z" },
  { id: "2", month: 1, year: 2025, total: 5120.5, closedAt: "2025-02-01T10:00:00Z" },
  { id: "3", month: 12, year: 2024, total: 6200.0, closedAt: "2025-01-01T10:00:00Z" },
  { id: "4", month: 11, year: 2024, total: 3980.0, closedAt: "2024-12-01T10:00:00Z" },
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Closures = () => {
  const navigate = useNavigate();
  const canCloseCurrentMonth = true; // Would come from API

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="section-title">Fechamentos</h1>
              <p className="text-muted-foreground text-sm">Histórico de faturamento mensal</p>
            </div>
          </div>

          {canCloseCurrentMonth && (
            <Button variant="action" size="lg" className="gap-2">
              <Lock className="w-4 h-4" />
              Fechar Mês Atual
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {MOCK_CLOSURES.map((closure) => (
            <div
              key={closure.id}
              onClick={() => navigate(`/closure-overview/${closure.id}`)}
              className="barber-card flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {String(closure.month).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {MONTH_NAMES[closure.month - 1]} {closure.year}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fechado em {new Date(closure.closedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">{formatBRL(closure.total)}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Closures;