import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

      toast.success("Categoria atualizada com sucesso!", {
        description: "As informações foram salvas.",
      });

      setEditingId(null);
      await loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar categoria");
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;

    try {
      await api.delete(`/category/${deleteId}`);

      toast.success("Categoria removida com sucesso!", {
        description: "A categoria foi excluída permanentemente.",
      });

      setDeleteId(null);
      await loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao remover categoria");
    } finally {
      setDeleteId(null);
      setShowConfirmDelete(false);
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

      toast.success("Categoria criada com sucesso!", {
        description: "A nova categoria foi cadastrada.",
      });

      setNewDesc("");
      setNewValue("");
      setDialogOpen(false);
      await loadCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao criar categoria");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in max-w-4xl">
        <Card className="barber-card overflow-hidden">
          <CardHeader>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Categorias</CardTitle>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="action" className="w-full sm:w-auto gap-2">
                    <Plus className="w-4 h-4" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border-subtle w-[95vw] max-w-md rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Nova Categoria</DialogTitle>
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
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      
                      <Button variant="action" className="w-full flex-1" onClick={handleCreate}>
                        Criar Categoria
                      </Button>
                      <Button variant="outline" className= "w-full sm:w-auto" onClick={() => setDialogOpen(false)}>
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
              <>
              <div className="hidden md:block overflow-x-auto">
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
                      <TableRow key={cat.categoryid} className="border-border-subtle">
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
                            <span className="text-foreground">{cat.categorydescription}</span>
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
                </div>
                <div className="space-y-4 md:hidden">
                  {categories.map((cat) => (
                    <Card
                      key={cat.categoryid}
                      className="barber-card"
                    >
                      <CardContent className="p-5 space-y-5">

                        {editingId === cat.categoryid ? (
                          <div className="space-y-4">

                            <div>
                              <Label className="mb-2 block">Descrição</Label>
                              <Input
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData((d) => ({
                                    ...d,
                                    description: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div>
                              <Label className="mb-2 block">Valor</Label>
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
                              />
                            </div>

                          </div>
                        ) : (
                        <div className="flex justify-between items-start gap-4">

                          {/* Descrição */}
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">
                              Descrição
                            </p>

                            {editingId === cat.categoryid ? (
                              <Input
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData((d) => ({
                                    ...d,
                                    description: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              <p className="font-medium text-foreground">
                                {cat.categorydescription}
                              </p>
                            )}
                          </div>

                          {/* Valor */}
                          <div className="text-right min-w-[90px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              Valor
                            </p>

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
                              />
                            ) : (
                              <p className="font-semibold text-primary">
                                R$ {Number(cat.categoryvalue).toFixed(2)}
                              </p>
                            )}
                          </div>

                        </div>
                        )}
                        {/* Botões */}
                        {editingId === cat.categoryid ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                              variant="action"
                              onClick={() => saveEdit(cat.categoryid)}
                            >
                              <span>Salvar</span>
                            </Button>

                            <Button
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              <span>Cancelar</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="h-11 text-sm"
                              onClick={() => startEdit(cat)}
                            >
                              <span>Editar</span>
                            </Button>

                            <Button
                              variant="destructive"
                              className="h-11 text-sm"
                              onClick={() => setDeleteId(cat.categoryid)}
                            >
                              <span>Excluir</span>
                            </Button>
                          </div>
                        )}

                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
            if (!open) {
                setDeleteId(null);
            }
        }}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Categories;