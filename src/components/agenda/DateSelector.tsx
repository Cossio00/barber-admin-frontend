import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector = ({ date, onDateChange }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const goToPreviousDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const goToNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToPreviousDay} 
        className="h-9 w-9"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 bg-card border-border-subtle min-w-[140px]"
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            {format(date, "dd/MM/yyyy", { locale: ptBR })}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-card border-border-subtle" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              if (d) {
                onDateChange(d);
                setOpen(false);
              }
            }}
            locale={ptBR}                   
            weekStartsOn={0}                 
            showOutsideDays={true}
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToNextDay} 
        className="h-9 w-9"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};