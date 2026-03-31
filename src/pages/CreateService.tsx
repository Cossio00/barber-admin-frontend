import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/services/api";



const CreateService = () => {
  const navigate = useNavigate();
  
  const [clients, setClients] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/client")
      .then((res) => setClients(res.data.list ?? res.data.clients ?? []))
      .catch((err) => console.error("Erro ao carregar clientes:", err));

    api.get("/category")
      .then((res) => setCategories(res.data.list ?? res.data.categories ?? []))
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, []);

  const selectedCategory = categories.find((c) => String(c.categoryid) === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !categoryId || !date || !time) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const [year, month, day] = date.split("-");
      const [hour, minute] = time.split(":");

      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:00`;

      await api.post("/service", {
        serviceclientid: clientId,
        servicecategoryid: Number(categoryId),
        servicedate: formattedDate,
      });

      toast.success("Serviço agendado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao agendar serviço");
    } finally {
      setLoading(false);
    }
  };


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
              <CardTitle className="text-xl">Novo Agendamento</CardTitle>
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
                    {clients.length === 0 ? (
                      <SelectItem value="none" disabled>Nenhum cliente disponível</SelectItem>
                    ) : (
                      clients.map((c) => (
                        <SelectItem key={c.clientid} value={String(c.clientid)}>
                          {c.clientname}
                        </SelectItem>
                      ))
                    )}
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
                    {categories.length === 0 ? (
                      <SelectItem value="none" disabled>Nenhuma categoria disponível</SelectItem>
                    ) : (
                      categories.map((c) => (
                        <SelectItem key={c.categoryid} value={String(c.categoryid)}>
                          {c.categorydescription} — R$ {Number(c.categoryvalue).toFixed(2)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <p className="text-sm text-primary font-medium">
                    Valor: R$ {Number(selectedCategory.categoryvalue).toFixed(2)}
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
                    lang="pt-BR"
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
                  {loading ? "Agendando..." : "Agendar Serviço"}
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

export default CreateService;
