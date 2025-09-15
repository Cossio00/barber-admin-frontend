import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import { TextField, Button } from "@mui/material";

function EditUser() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState({ clientname: "", clientphone: "" });

    useEffect(() => {
        api.get(`/client/${clientId}`)
            .then((res) => {
                const clientsArray = res.data.list ? res.data.list() : res.data;
                const c = clientsArray.find((cl) => cl.clientid === clientId);
                if (c) setClient(c);
            })
            .catch((err) => console.error(err));
    }, [clientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/client/${clientId}`, client);
            alert("Cliente atualizado!");
            navigate("/users");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="edit-user">
            <h1>Editar Cliente</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nome"
                    value={client.clientname}
                    onChange={(e) => setClient({ ...client, clientname: e.target.value })}
                    required
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Telefone"
                    value={client.clientphone}
                    onChange={(e) => setClient({ ...client, clientphone: e.target.value })}
                    required
                    style={{ marginRight: "10px" }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Salvar
                </Button>
            </form>
        </div>
    );
}

export default EditUser;
