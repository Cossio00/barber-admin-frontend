import React, { useEffect, useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";

function User() {
    const [clients, setClients] = useState([]);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const navigate = useNavigate();

    // Carregar clientes
    const loadClients = async () => {
        try {
            const response = await api.get("/client");
            // Como a API retorna Clients.list(), precisamos mapear
            const clientsArray = response.data.list ? response.data.list() : response.data;
            setClients(clientsArray.clients);
        } catch (err) {
            console.error("Erro ao carregar clientes:", err);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    // Criar novo cliente
    const handleAddClient = async (e) => {
        e.preventDefault();
        if (!newName || !newPhone) return alert("Preencha nome e telefone");

        try {
            await api.post("/client", { clientname: newName, clientphone: newPhone });
            setNewName("");
            setNewPhone("");
            loadClients();
        } catch (err) {
            console.error("Erro ao criar cliente:", err);
        }
    };

    // Deletar cliente
    const handleDeleteClient = async () => {
        if (!clientToDelete) return;
        try {
            await api.delete(`/client/${clientToDelete.clientid}`);
            setOpenDeleteDialog(false);
            setClientToDelete(null);
            loadClients();
        } catch (err) {
            console.error("Erro ao deletar cliente:", err);
        }
    };

    return (
        <div className="user-page">
            <h1>Gerenciar Clientes</h1>

            <form onSubmit={handleAddClient} style={{ marginBottom: "20px" }}>
                <TextField
                    label="Nome"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Telefone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                    style={{ marginRight: "10px" }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Adicionar Cliente
                </Button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.clientid}>
                            <td>{client.clientname}</td>
                            <td>{client.clientphone}</td>
                            <td>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        setClientToDelete(client);
                                        setOpenDeleteDialog(true);
                                    }}
                                >
                                    Excluir
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    style={{ marginLeft: "5px" }}
                                    onClick={() => navigate(`/edit-client/${client.clientid}`)}
                                >
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Dialogo de confirmação */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogContent>
                    <DialogContentText>Deseja realmente deletar este cliente?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClient}>Sim</Button>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Não</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default User;
