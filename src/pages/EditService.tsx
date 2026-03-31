import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scissors, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import api from "@/services/api";

type Category = {
  categoryid: number
  categorydescription: string
  categoryvalue: number
}

const EditService = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [clientName, setClientName] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  const [categoryId, setCategoryId] = useState("")
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState("")

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const selectedCategory = categories.find(c => String(c.categoryid) === categoryId)

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0")
    const m = String(d.getMinutes()).padStart(2, "0")
    return `${h}:${m}`
  }

  const loadService = async () => {
    try {
        const res = await api.get(`/service-agenda/${id}`)
        const data = res.data

        const parsedDate = new Date(data.servicedate)

        setClientName(data.clientname)
        setCategoryId(String(data.servicecategory))
        setDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()))
        setTime(formatTime(parsedDate))

    } catch (err) {
        console.error(err)
        toast.error("Erro ao carregar serviço")
    }
  }

  const loadCategories = async () => {
    try {
      const res = await api.get("/category")
      setCategories(res.data.list ?? res.data.categories ?? [])
    } catch (err) {
      console.error("Erro ao carregar categorias", err)
    }
  }

  useEffect(() => {
    const init = async () => {
      await loadCategories()
      await loadService()
      setFetching(false)
      setFetching(false)
    }

    init()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryId || !date || !time) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)

    try {

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      const [hour, minute] = time.split(":")

      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:00`

      await api.put(`/service/${id}`, {
        servicedate: formattedDate,
        servicecategoryid: Number(categoryId)
      })

      toast.success("Serviço atualizado com sucesso!")
      navigate("/")

    } catch (err) {
      console.error(err)
      toast.error("Erro ao atualizar serviço")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in max-w-2xl">

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
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

              {/* CLIENTE */}
              <div className="space-y-2">
                <Label>Cliente</Label>
                <div className="border rounded-md px-3 h-10 flex items-center text-muted-foreground">
                  {clientName}
                </div>
              </div>

              {/* CATEGORIA */}
              <div className="space-y-2">

                <Label>Categoria de Serviço</Label>

                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.categoryid} value={String(c.categoryid)}>
                        {c.categorydescription} — R$ {Number(c.categoryvalue).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>

                {selectedCategory && (
                  <p className="text-sm text-primary font-medium">
                    Valor: R$ {Number(selectedCategory.categoryvalue).toFixed(2)}
                  </p>
                )}

              </div>

              {/* DATA + HORÁRIO */}
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">

                  <Label>Data</Label>

                  <Popover>

                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={ptBR}
                      />
                    </PopoverContent>

                  </Popover>

                </div>

                <div className="space-y-2">

                  <Label>Horário</Label>

                  <div className="flex items-center gap-2 border rounded-md px-3 h-10">

                    <Clock className="w-4 h-4 text-muted-foreground" />

                    <input
                      type="text"
                      placeholder="12:00"
                      value={time}
                      maxLength={5}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "")

                        if (v.length >= 3) v = v.slice(0, 2) + ":" + v.slice(2, 4)
                        if (v.length > 5) v = v.slice(0, 5)

                        setTime(v)
                      }}
                      className="bg-transparent outline-none w-full"
                    />

                  </div>

                </div>

              </div>

              <div className="flex gap-3 pt-4">

                <Button
                  type="submit"
                  variant="action"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>
    </div>
  )
}

export default EditService