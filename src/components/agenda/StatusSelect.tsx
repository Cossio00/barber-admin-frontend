interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  agendado: { label: "Agendado", className: "status-agendado" },
  concluido: { label: "Concluído", className: "status-concluido" },
  cancelado: { label: "Cancelado", className: "status-cancelado" },
};

export const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${STATUS_CONFIG[value]?.className || "status-agendado"} cursor-pointer border-0 appearance-none text-center pr-6 bg-no-repeat bg-[length:12px] bg-[right_8px_center]`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
      }}
    >
      <option value="agendado">Agendado</option>
      <option value="concluido">Concluído</option>
      <option value="cancelado">Cancelado</option>
    </select>
  );
};
