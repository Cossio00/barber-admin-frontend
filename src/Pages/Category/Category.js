import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function Category() {
    const [categories, setCategories] = useState([]);
    const [newDescription, setNewDescription] = useState("");
    const [newValue, setNewValue] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const navigate = useNavigate();

    // carregar categorias
    const loadCategories = async () => {
        try {
            const response = await api.get("/category");
            const data = response.data.list ? response.data.list() : response.data;
            setCategories(data.categories);
        } catch (err) {
            console.error("Erro ao carregar categorias:", err);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // criar categoria
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newDescription || !newValue) return alert("Preencha todos os campos");

        try {
            await api.post("/category", {
                categorydescription: newDescription,
                categoryvalue: newValue,
            });
            setNewDescription("");
            setNewValue("");
            loadCategories();
        } catch (err) {
            console.error("Erro ao criar categoria:", err);
        }
    };

    // deletar categoria
    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await api.delete(`/category/${categoryToDelete.categoryid}`);
            setOpenDeleteDialog(false);
            setCategoryToDelete(null);
            loadCategories();
        } catch (err) {
            console.error("Erro ao deletar categoria:", err);
        }
    };

    return (
        <div className="category-page">
            <h1>Gerenciar Categorias</h1>

            <form onSubmit={handleAddCategory} style={{ marginBottom: "20px" }}>
                <TextField
                    label="Descrição"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Valor"
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Adicionar
                </Button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.categoryid}>
                            <td>{category.categorydescription}</td>
                            <td>{category.categoryvalue}</td>
                            <td>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate(`/edit-category/${category.categoryid}`)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    style={{ marginLeft: "5px" }}
                                    onClick={() => {
                                        setCategoryToDelete(category);
                                        setOpenDeleteDialog(true);
                                    }}
                                >
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Dialog de exclusão */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir esta categoria?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCategory}>Sim</Button>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Não</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Category;
