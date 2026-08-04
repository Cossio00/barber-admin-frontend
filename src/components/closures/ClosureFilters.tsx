import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import api from "@/services/api";

export interface ClosureFilterValues {
  category: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface Category {
  categoryid: number;
  categorydescription: string;
}

interface ClosureFiltersProps {
  month: number;
  year: number;
  filters: ClosureFilterValues;
  onFiltersChange: (filters: ClosureFilterValues) => void;
}

export const ClosureFilters = ({
  month,
  year,
  filters,
  onFiltersChange,
}: ClosureFiltersProps) => {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);

  const monthDate = new Date(year, month - 1, 1);
  const minDate = startOfMonth(monthDate);
  const maxDate = endOfMonth(monthDate);

  const hasFilters = !!(filters.category || filters.dateFrom || filters.dateTo);

  const disabledDays = (date: Date) => date < minDate || date > maxDate;

  const clearFilters = () => {
    onFiltersChange({
      category: null,
      dateFrom: null,
      dateTo: null,
    });
    setTempRange(undefined);
    setRangeOpen(false);
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/category");
      setCategories(res.data.categories || res.data || []);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  // Reseta tempRange quando o popover abre
  useEffect(() => {
    if (rangeOpen) {
      setTempRange(undefined);
    }
  }, [rangeOpen]);

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Filter className="w-4 h-4 text-muted-foreground" />

      {/* Categoria */}
      <Select
        value={filters.category || "all"}
        onValueChange={(val) =>
          onFiltersChange({
            ...filters,
            category: val === "all" ? null : val,
          })
        }
      >
        <SelectTrigger className="w-[180px] bg-card border-border-subtle">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border-subtle">
          <SelectItem value="all">Todas categorias</SelectItem>
          {categories.map((cat) => (
            <SelectItem
              key={cat.categoryid}
              value={String(cat.categoryid)}
            >
              {cat.categorydescription}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Range de datas */}
      <Popover open={rangeOpen} onOpenChange={setRangeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[260px] justify-start text-left font-normal bg-card border-border-subtle",
              !filters.dateFrom && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateFrom && filters.dateTo
              ? `${format(filters.dateFrom, "dd/MM/yyyy")} - ${format(filters.dateTo, "dd/MM/yyyy")}`
              : "Selecionar período"}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-card border-border-subtle"
          align="start"
        >
          <Calendar
            mode="range"
            selected={tempRange}
            onSelect={setTempRange}
            disabled={disabledDays}
            defaultMonth={monthDate}
            locale={ptBR}
            className="p-3 pointer-events-auto"
            numberOfMonths={1}
          />

          <div className="p-3 border-t flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRangeOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={!tempRange?.from || !tempRange?.to}
              onClick={() => {
                if (tempRange?.from && tempRange?.to) {
                  onFiltersChange({
                    ...filters,
                    dateFrom: tempRange.from,
                    dateTo: tempRange.to,
                  });
                  setRangeOpen(false);
                }
              }}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Botão Limpar */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1 text-muted-foreground"
        >
          <X className="w-4 h-4" />
          Limpar
        </Button>
      )}
    </div>
  );
};