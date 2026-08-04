import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ClosureFilters,
  ClosureFilterValues,
} from "@/components/closures/ClosureFilters";
import api from "@/services/api";
import { toast } from "sonner";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

const ClosureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [closureMonth, setClosureMonth] = useState<number | null>(null);
  const [closureYear, setClosureYear] = useState<number | null>(null);
  const [filters, setFilters] = useState<ClosureFilterValues>({
    category: null,
    dateFrom: null,
    dateTo: null,
  });

  const loadClosureInfo = async () => {
    try {
      const res = await api.get(`/closure-overview/${id}`);
      const monthYear = res.data.closuremonthyear;
      const [year, month] = monthYear.split("-");
      setClosureYear(Number(year));
      setClosureMonth(Number(month));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados do fechamento");
    }
  };

  const loadDetails = async () => {
    try {
      const res = await api.get(`/closure-details/${id}`, {
        params: {
          startDate: formatDate(filters.dateFrom),
          endDate: formatDate(filters.dateTo),
          categoryId: filters.category,
        },
      });
      setServices(res.data.services || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar serviços");
    }
  };

  // Carrega informação do fechamento
  useEffect(() => {
    loadClosureInfo();
  }, [id]);

  // Define datas padrão (mês completo) apenas na primeira vez
  useEffect(() => {
    if (closureMonth && closureYear && !filters.dateFrom && !filters.dateTo) {
      const defaultFrom = new Date(closureYear, closureMonth - 1, 1);
      const defaultTo = new Date(closureYear, closureMonth, 0);

      setFilters((prev) => ({
        ...prev,
        dateFrom: defaultFrom,
        dateTo: defaultTo,
      }));
    }
  }, [closureMonth, closureYear]);

  // ✅ CORREÇÃO PRINCIPAL: Carrega os dados quando:
  // - Tem ambas as datas, OU
  // - Não tem nenhuma data (caso do "Limpar")
  useEffect(() => {
    const hasBothDates = filters.dateFrom && filters.dateTo;
    const hasNoDates = !filters.dateFrom && !filters.dateTo;

    if (!hasBothDates && !hasNoDates) return;

    loadDetails();
  }, [id, filters.category, filters.dateFrom, filters.dateTo]);

  const total = services.reduce(
    (sum, item) => sum + Number(item.totalValue || 0),
    0
  );

  if (!closureMonth || !closureYear) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate(`/closure-overview/${id}`)}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Overview
        </Button>

        <div className="mb-6">
          <h1 className="section-title">Serviços Detalhados</h1>
        </div>

        <ClosureFilters
          month={closureMonth}
          year={closureYear}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-surface">
                <th className="text-left px-5 py-4 text-xs uppercase">Data</th>
                <th className="text-left px-5 py-4 text-xs uppercase">Serviço</th>
                <th className="text-right px-5 py-4 text-xs uppercase">Valor</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item, index) => (
                <tr key={index} className="border-b border-border-subtle/50">
                  <td className="px-5 py-4 text-sm">
                    {new Date(item.servicedate).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-4 text-sm">{item.categorydescription}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-right">
                    {formatBRL(item.totalValue)}
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-muted-foreground text-sm"
                  >
                    Nenhum serviço encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-border-subtle bg-surface">
                <td colSpan={2} className="px-5 py-4 font-semibold">
                  Total ({services.length} serviços)
                </td>
                <td className="px-5 py-4 font-bold text-primary text-right">
                  {formatBRL(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClosureDetails;