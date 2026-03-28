import { DollarSign, Clock, CheckCircle, BarChart3 } from "lucide-react";

interface DailyStatsProps {
  total: number;
  agendados: number;
  concluidos: number;
  totalServicos: number;
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

export const DailyStats = ({ total, agendados, concluidos, totalServicos }: DailyStatsProps) => {
  const stats = [
    {
      label: "Faturamento",
      value: formatBRL(total),
      icon: DollarSign,
      highlight: true,
    },
    {
      label: "Total de Serviços",
      value: totalServicos.toString(),
      icon: BarChart3,
    },
    {
      label: "Agendados",
      value: agendados.toString(),
      icon: Clock,
    },
    {
      label: "Concluídos",
      value: concluidos.toString(),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`stat-card ${stat.highlight ? "border-primary/30" : ""}`}
        >
          <div className="flex items-center gap-2">
            <stat.icon
              className={`w-4 h-4 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <span
            className={`text-2xl font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};
