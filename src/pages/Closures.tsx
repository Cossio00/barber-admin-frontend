import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight, Lock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Closure {
  closureid: string;
  closuremonthyear: string;
  closureclosed_at: string;
  closuretotalcalculated: number;
}

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const Closures = () => {
  const navigate = useNavigate();
  const [closures, setClosures] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Estados para confirmação
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [monthToClose, setMonthToClose] = useState<string>("");

  const loadClosures = async () => {
    try {
      const res = await api.get("/closure");
      const responseData = res.data;
      let closuresList: Closure[] = [];

      if (responseData.closures?.list) closuresList = responseData.closures.list;
      else if (Array.isArray(responseData.closures)) closuresList = responseData.closures;
      else if (Array.isArray(responseData.list)) closuresList = responseData.list;

      setClosures(closuresList);
    } catch (err: any) {
      console.error("Erro ao carregar fechamentos:", err);
      toast.error(err?.response?.data?.message || "Erro ao carregar fechamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClosures();
  }, []);

  const confirmCloseMonth = (monthYear: string) => {
    setMonthToClose(monthYear);
    setShowConfirmClose(true);
  };

  const handleCloseConfirmed = async () => {
    if (!monthToClose) return;

    try {
      await api.post("/closure", { closuremonthyear: monthToClose });
      
      toast.success(`Mês ${monthToClose} fechado com sucesso!`, {
        description: "O fechamento foi realizado e os dados foram atualizados.",
      });
      
      loadClosures();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          "Erro ao fechar mês";
      toast.error(errorMessage);
    } finally {
      setShowConfirmClose(false);
      setMonthToClose("");
    }
  };

  const handleCloseLastMonth = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
    confirmCloseMonth(monthYear);
  };

  const handleCloseSpecificMonth = () => {
    const monthYear = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    confirmCloseMonth(monthYear);
    setIsCloseDialogOpen(false);
  };

  if (loading) return <div className="p-10">Carregando...</div>;

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

          <div className="flex gap-3">
            <Button variant="action" size="lg" className="gap-2" onClick={handleCloseLastMonth}>
              <Lock className="w-4 h-4" />
              Fechar Último Mês
            </Button>

            <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Fechar Mês Específico
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Fechar Mês Específico</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mês</Label>
                      <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTH_NAMES.map((name, index) => (
                            <SelectItem key={index + 1} value={String(index + 1)}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Ano</Label>
                      <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="action" onClick={handleCloseSpecificMonth} className="flex-1">
                      Confirmar Seleção
                    </Button>
                    <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de Fechamentos */}
        <div className="grid gap-4">
          {closures.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Nenhum fechamento realizado ainda.
            </p>
          ) : (
            closures.map((closure) => {
              const [year, month] = closure.closuremonthyear.split("-");
              return (
                <div
                  key={closure.closureid}
                  onClick={() => navigate(`/closure-overview/${closure.closureid}`)}
                  className="barber-card flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{month}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {MONTH_NAMES[Number(month) - 1]} {year}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fechado em {new Date(closure.closureclosed_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      {formatBRL(closure.closuretotalcalculated)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        title="Fechar Mês"
        description={`Tem certeza que deseja fechar o mês ${monthToClose}? Esta ação não pode ser desfeita.`}
        confirmText="Fechar Mês"
        variant="default"
        onConfirm={handleCloseConfirmed}
      />
    </div>
  );
};

export default Closures;