import React, { useState } from "react";
//import "./addService.css";    --implementar
import api from "../../../Services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreateService() {
    const [clientName, setClientName] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Cria um objeto Date completo com data + horário
        const serviceDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );

        try {
            await api.post("/service", {
                clientname: clientName,
                servicedate: serviceDate.toISOString(),
            });
            alert("Serviço adicionado com sucesso!");
            navigate("/"); // Volta para a Home
        } catch (err) {
            console.error("Erro ao adicionar serviço:", err);
            alert("Ocorreu um erro ao adicionar o serviço.");
        }
    };

    return (
        <div className="add-service">
            <div className="add-service-form-grid">
                <h1>Adicionar Novo Serviço</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nome do Cliente"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                        <DatePicker
                            label="Data"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            format="dd/MM/yyyy"
                        />
                        <TimePicker
                            label="Horário"
                            value={selectedTime}
                            onChange={(time) => setSelectedTime(time)}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: "20px" }}>
                        Adicionar Serviço
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default CreateService;
