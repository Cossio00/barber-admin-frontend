import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DeleteServiceDialog } from "@/components/agenda/DeleteServiceDialog";
import api from "@/services/api";

interface Client {
  clientid: string;
  clientname: string;
  clientphone: string;
}

const formatPhone = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Clients = () => {

  const [clients, setClients] = useState<Client[]>([])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: "", phone: "" })

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")

  const loadClients = async () => {
    try {

      const res = await api.get("/client")

      const data = res.data.list ?? res.data.clients ?? []

      setClients(data)

    } catch (err) {

      console.error(err)
      toast.error("Erro ao carregar clientes")

    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const onlyNumbers = (v: string) => v.replace(/\D/g, "")

  const startEdit = (client: Client) => {

    setEditingId(client.clientid)

    setEditData({
      name: client.clientname,
      phone: client.clientphone
    })

  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (id: string) => {

    if (!editData.name.trim() || !editData.phone.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    try {

      await api.put(`/client/${id}`, {
        clientname: editData.name,
        clientphone: onlyNumbers(editData.phone)
      })

      toast.success("Cliente atualizado com sucesso!")

      setEditingId(null)

      loadClients()

    } catch (err) {

      console.error(err)
      toast.error("Erro ao atualizar cliente")

    }

  }

  const handleDelete = async () => {

    if (!deleteId) return

    try {

      await api.delete(`/client/${deleteId}`)

      toast.success("Cliente removido com sucesso!")

      setDeleteId(null)

      loadClients()

    } catch (err) {

      console.error(err)
      toast.error("Erro ao remover cliente")

    }

  }

  const handleCreate = async () => {

    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    try {

      await api.post("/client", {
        clientname: newName,
        clientphone: onlyNumbers(newPhone)
      })

      toast.success("Cliente criado com sucesso!")

      setNewName("")
      setNewPhone("")
      setDialogOpen(false)

      loadClients()

    } catch (err) {

      console.error(err)
      toast.error("Erro ao criar cliente")

    }

  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in max-w-4xl">

        <Card className="barber-card">

          <CardHeader>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>

                <CardTitle className="text-xl">
                  Clientes
                </CardTitle>

              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                <DialogTrigger asChild>

                  <Button variant="action" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                  </Button>

                </DialogTrigger>

                <DialogContent className="bg-card border-border-subtle">

                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Novo Cliente
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 pt-2">

                    <div className="space-y-2">

                      <Label>Nome</Label>

                      <Input
                        placeholder="Nome completo"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />

                    </div>

                    <div className="space-y-2">

                      <Label>Telefone</Label>

                      <Input
                        placeholder="(00) 00000-0000"
                        value={newPhone}
                        onChange={(e) => setNewPhone(formatPhone(e.target.value))}
                      />

                    </div>

                    <div className="flex gap-3 pt-2">

                      <Button
                        variant="action"
                        className="flex-1"
                        onClick={handleCreate}
                      >
                        Criar Cliente
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancelar
                      </Button>

                    </div>

                  </div>

                </DialogContent>

              </Dialog>

            </div>

          </CardHeader>

          <CardContent>

            {clients.length === 0 ? (

              <p className="text-muted-foreground text-center py-8">
                Nenhum cliente cadastrado.
              </p>

            ) : (

              <Table>

                <TableHeader>

                  <TableRow className="border-border-subtle">

                    <TableHead>Nome</TableHead>

                    <TableHead className="w-44">
                      Telefone
                    </TableHead>

                    <TableHead className="w-24 text-right">
                      Ações
                    </TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {clients.map((client) => (

                    <TableRow key={client.clientid} className="border-border-subtle">

                      <TableCell>

                        {editingId === client.clientid ? (

                          <Input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData(d => ({ ...d, name: e.target.value }))
                            }
                            className="h-8"
                          />

                        ) : (

                          <span className="text-foreground">
                            {client.clientname}
                          </span>

                        )}

                      </TableCell>

                      <TableCell>

                        {editingId === client.clientid ? (

                          <Input
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData(d => ({
                                ...d,
                                phone: formatPhone(e.target.value)
                              }))
                            }
                            className="h-8 w-40"
                          />

                        ) : (

                          <span className="text-muted-foreground">
                            {client.clientphone}
                          </span>

                        )}

                      </TableCell>

                      <TableCell className="text-right">

                        {editingId === client.clientid ? (

                          <div className="flex justify-end gap-1">

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-400 hover:text-green-300"
                              onClick={() => saveEdit(client.clientid)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground"
                              onClick={cancelEdit}
                            >
                              <X className="w-4 h-4" />
                            </Button>

                          </div>

                        ) : (

                          <div className="flex justify-end gap-1">

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => startEdit(client)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteId(client.clientid)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                          </div>

                        )}

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            )}

          </CardContent>

        </Card>

      </div>

      <DeleteServiceDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

    </div>
  )

}

export default Clients