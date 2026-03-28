import { useState } from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AgendaTable } from "@/components/agenda/AgendaTable";
import { DailyStats } from "@/components/agenda/DailyStats";
import { DateSelector } from "@/components/agenda/DateSelector";
import { DeleteServiceDialog } from "@/components/agenda/DeleteServiceDialog";

// Mock data for demonstration
const MOCK_SERVICES = [
  { serviceid: "1", servicedate: new Date().toISOString(), clientname: "João Silva", servicecategory: "Corte Degradê", categoryvalue: 45, servicestatus: "concluido" },
  { serviceid: "2", servicedate: new Date().toISOString(), clientname: "Pedro Santos", servicecategory: "Barba", categoryvalue: 30, servicestatus: "agendado" },
  { serviceid: "3", servicedate: new Date().toISOString(), clientname: "Lucas Oliveira", servicecategory: "Corte + Barba", categoryvalue: 65, servicestatus: "agendado" },
  { serviceid: "4", servicedate: new Date().toISOString(), clientname: "Marcos Costa", servicecategory: "Corte Social", categoryvalue: 40, servicestatus: "cancelado" },
  { serviceid: "5", servicedate: new Date().toISOString(), clientname: "Rafael Lima", servicecategory: "Corte Degradê", categoryvalue: 45, servicestatus: "concluido" },
];

export type ServiceItem = {
  serviceid: string;
  servicedate: string;
  clientname: string;
  servicecategory: string;
  categoryvalue: number;
  servicestatus: string;
};

const Index = () => {
  const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [agendaDate, setAgendaDate] = useState<Date>(new Date());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const navigate = useNavigate();

  const title = isToday(agendaDate)
    ? "Agenda de Hoje"
    : `Agenda de ${format(agendaDate, "dd/MM", { locale: ptBR })}`;

  const handleStatusChange = (serviceId: string, newStatus: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.serviceid === serviceId ? { ...item, servicestatus: newStatus } : item
      )
    );
  };

  const handleDelete = () => {
    setServices((prev) => prev.filter((item) => item.serviceid !== selectedServiceId));
    setDeleteDialogOpen(false);
    setSelectedServiceId("");
  };

  const handleOpenDelete = (id: string) => {
    setSelectedServiceId(id);
    setDeleteDialogOpen(true);
  };

  const totalConcluido = services
    .filter((s) => s.servicestatus === "concluido")
    .reduce((acc, s) => acc + Number(s.categoryvalue || 0), 0);

  const totalAgendado = services.filter((s) => s.servicestatus === "agendado").length;
  const totalConcluidos = services.filter((s) => s.servicestatus === "concluido").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="section-title">{title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {format(agendaDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DateSelector date={agendaDate} onDateChange={setAgendaDate} />
            <Button
              variant="action"
              size="lg"
              onClick={() => navigate("/create-service")}
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DailyStats
          total={totalConcluido}
          agendados={totalAgendado}
          concluidos={totalConcluidos}
          totalServicos={services.length}
        />

        {/* Table */}
        <AgendaTable
          services={services}
          onStatusChange={handleStatusChange}
          onEdit={(id) => navigate(`/edit-service/${id}`)}
          onDelete={handleOpenDelete}
        />

        {/* Delete Dialog */}
        <DeleteServiceDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default Index;