import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusSelect } from "./StatusSelect";
import type { ServiceItem } from "@/pages/Index";

interface AgendaTableProps {
  services: ServiceItem[];
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

export const AgendaTable = ({ services, onStatusChange, onEdit, onDelete }: AgendaTableProps) => {
  if (services.length === 0) {
    return (
      <div className="table-container p-12 text-center">
        <p className="text-muted-foreground text-lg">Nenhum serviço agendado para esta data.</p>
      </div>
    );
  }

  const totalValue = services
    .filter((s) => s.servicestatus === "concluido")
    .reduce((acc, s) => acc + Number(s.categoryvalue || 0), 0);

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-surface">
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Horário
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Serviço
              </th>
              <th className="text-right px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Valor
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => {
              const horario = new Date(service.servicedate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <tr
                  key={service.serviceid}
                  className={`border-b border-border-subtle/50 hover:bg-surface-elevated/50 transition-colors ${
                    service.servicestatus === "cancelado" ? "opacity-50" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    {horario}
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">
                    {service.clientname}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {service.servicecategory}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground text-right">
                    {formatBRL(service.categoryvalue)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <StatusSelect
                      value={service.servicestatus}
                      onChange={(val) => onStatusChange(service.serviceid, val)}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(service.serviceid)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(service.serviceid)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface">
              <td colSpan={3} className="px-5 py-4 text-sm font-bold text-foreground">
                Total (Concluídos)
              </td>
              <td className="px-5 py-4 text-sm font-bold text-primary text-right">
                {formatBRL(totalValue)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
