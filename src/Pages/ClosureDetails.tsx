import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_DETAILS = [
  { id: "1", date: "2025-02-03", client: "João Silva", service: "Corte Degradê", value: 45 },
  { id: "2", date: "2025-02-03", client: "Pedro Santos", service: "Barba", value: 30 },
  { id: "3", date: "2025-02-05", client: "Lucas Oliveira", service: "Corte + Barba", value: 65 },
  { id: "4", date: "2025-02-07", client: "Marcos Costa", service: "Corte Social", value: 40 },
  { id: "5", date: "2025-02-10", client: "Rafael Lima", service: "Corte Degradê", value: 45 },
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const ClosureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const hasFilters = false; // Would be managed by state

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate(`/closure-overview/${id}`)}
          className="gap-2 mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Overview
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Serviços Detalhados</h1>
            <p className="text-muted-foreground text-sm">Fevereiro 2025</p>
          </div>

          {hasFilters && (
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <X className="w-4 h-4" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* TODO: Add date range and category filters here */}

        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-surface">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Serviço</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DETAILS.map((item) => (
                  <tr key={item.id} className="border-b border-border-subtle/50 hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-foreground">
                      {new Date(item.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{item.client}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{item.service}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground text-right">
                      {formatBRL(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosureDetails;
