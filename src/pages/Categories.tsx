import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DeleteServiceDialog } from "@/components/agenda/DeleteServiceDialog";
import api from "@/services/api";

interface Category {
  categoryid: number;
  categorydescription: string;
  categoryvalue: number;
}

const Categories = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ description: "", value: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newValue, setNewValue] = useState("");

  const loadCategories = async () => {
    try {
      const res = await api.get("/category");
      const data = res.data.list ?? res.data.categories ?? res.data;
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
      toast.error("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat.categoryid);
    setEditData({
      description: cat.categorydescription,
      value: String(cat.categoryvalue),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    if (!editData.description.trim() || !editData.value.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await api.put(`/category/${id}`, {
        categorydescription: editData.description,
        categoryvalue: Number(editData.value),
      });

      setEditingId(null);
      await loadCategories();

      toast.success("Categoria atualizada!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;

    try {
      await api.delete(`/category/${deleteId}`);
      setDeleteId(null);
      await loadCategories();

      toast.success("Categoria removida!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover categoria");
    }
  };

  const handleCreate = async () => {
    if (!newDesc.trim() || !newValue.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await api.post("/category", {
        categorydescription: newDesc,
        categoryvalue: Number(newValue),
      });

      setNewDesc("");
      setNewValue("");
      setDialogOpen(false);

      await loadCategories();

      toast.success("Categoria criada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar categoria");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in max-w-4xl">

        <Card className="barber-card">

          <CardHeader>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>

                <CardTitle className="text-xl">
                  Categorias
                </CardTitle>

              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

                <DialogTrigger asChild>

                  <Button variant="action" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Categoria
                  </Button>

                </DialogTrigger>

                <DialogContent className="bg-card border-border-subtle">

                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Nova Categoria
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 pt-2">

                    <div className="space-y-2">

                      <Label>Descrição</Label>

                      <Input
                        placeholder="Ex: Corte Degradê"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                      />

                    </div>

                    <div className="space-y-2">

                      <Label>Valor (R$)</Label>

                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                      />

                    </div>

                    <div className="flex gap-3 pt-2">

                      <Button
                        variant="action"
                        className="flex-1"
                        onClick={handleCreate}
                      >
                        Criar Categoria
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

            {categories.length === 0 ? (

              <p className="text-muted-foreground text-center py-8">
                Nenhuma categoria cadastrada.
              </p>

            ) : (

              <Table>

                <TableHeader>

                  <TableRow className="border-border-subtle">
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-32">Valor</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>

                </TableHeader>

                <TableBody>

                  {categories.map((cat) => (

                    <TableRow
                      key={cat.categoryid}
                      className="border-border-subtle"
                    >

                      <TableCell>

                        {editingId === cat.categoryid ? (

                          <Input
                            value={editData.description}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                description: e.target.value,
                              }))
                            }
                            className="h-8"
                          />

                        ) : (

                          <span className="text-foreground">
                            {cat.categorydescription}
                          </span>

                        )}

                      </TableCell>

                      <TableCell>

                        {editingId === cat.categoryid ? (

                          <Input
                            type="number"
                            step="0.01"
                            value={editData.value}
                            onChange={(e) =>
                              setEditData((d) => ({
                                ...d,
                                value: e.target.value,
                              }))
                            }
                            className="h-8 w-24"
                          />

                        ) : (

                          <span className="text-foreground font-medium">
                            R$ {Number(cat.categoryvalue).toFixed(2)}
                          </span>

                        )}

                      </TableCell>

                      <TableCell className="text-right">

                        {editingId === cat.categoryid ? (

                          <div className="flex justify-end gap-1">

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-400 hover:text-green-300"
                              onClick={() => saveEdit(cat.categoryid)}
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
                              onClick={() => startEdit(cat)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteId(cat.categoryid)}
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
  );
};

export default Categories;