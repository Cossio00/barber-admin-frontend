import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, BarChart3, TrendingUp, FileDown, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const ClosureOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data — replace with API call
  const overview = {
    month: "Fevereiro",
    year: 2025,
    total: 4850.0,
    serviceCount: 112,
    average: 43.3,
  };

  const stats = [
    { label: "Total do Mês", value: formatBRL(overview.total), icon: DollarSign, highlight: true },
    { label: "Serviços Realizados", value: overview.serviceCount.toString(), icon: BarChart3 },
    { label: "Ticket Médio", value: formatBRL(overview.average), icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/closures")}
          className="gap-2 mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <h1 className="section-title mb-2">
          {overview.month} {overview.year}
        </h1>
        <p className="text-muted-foreground mb-8">Visão geral do fechamento</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`stat-card ${stat.highlight ? "border-primary/30" : ""}`}
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <span className={`text-3xl font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="action"
            size="lg"
            className="gap-2"
            onClick={() => navigate(`/closure-details/${id}`)}
          >
            <List className="w-4 h-4" />
            Ver Serviços Detalhados
          </Button>
          <Button variant="outline" size="lg" className="gap-2 bg-card border-border-subtle">
            <FileDown className="w-4 h-4" />
            Gerar Relatório PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClosureOverview;
