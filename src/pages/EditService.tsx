import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MOCK_CLIENTS = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Pedro Santos" },
  { id: "3", name: "Lucas Oliveira" },
];

const MOCK_CATEGORIES = [
  { id: "1", description: "Corte Degradê", value: 45 },
  { id: "2", description: "Barba", value: 30 },
  { id: "3", description: "Corte + Barba", value: 65 },
];

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const selectedCategory = MOCK_CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    // TODO: api.get(`/service/${id}`)
    setTimeout(() => {
      setClientId("1");
      setCategoryId("1");
      setDate("2026-03-30");
      setTime("14:00");
      setFetching(false);
    }, 300);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !categoryId || !date || !time) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      // TODO: api.put(`/service/${id}`, { clientId, categoryId, date, time })
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Serviço atualizado com sucesso!" );
      navigate("/");
    } catch {
      toast.error("Erro ao atualizar serviço");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card className="barber-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Editar Agendamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CLIENTS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria de Serviço</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.description} — R$ {c.value.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <p className="text-sm text-primary font-medium">
                    Valor: R$ {selectedCategory.value.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="action" size="lg" className="flex-1" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditService;
