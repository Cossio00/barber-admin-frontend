import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editService.css";
import api from "../../../Services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

function formatSQLDate(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function EditService() {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        // Carregar serviço
        api.get(`/service-agenda/${serviceId}`)
            .then((res) => {
                const data = res.data;
                setService(data);

                const parsedDate = new Date(data.servicedate);
                setSelectedDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
                setSelectedTime(new Date(0, 0, 0, parsedDate.getHours(), parsedDate.getMinutes()));
                setSelectedCategory(data.categoryid ?? data.servicecategoryid);
            })
            .catch((err) => console.error("Erro ao carregar serviço:", err));

        // Carregar categorias
        api.get("/category")
            .then((res) => setCategories(res.data.categories))
            .catch((err) => console.error("Erro ao carregar categorias:", err));
    }, [serviceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory || !selectedDate || !selectedTime) {
            alert("Selecione categoria, data e hora.");
            return;
        }

        const serviceDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );

        const formattedDate = formatSQLDate(serviceDate);

        try {
            await api.put(`/service/${serviceId}`, {
                serviceclientid: service.clientid, // não alteramos cliente
                servicedate: formattedDate,
                servicecategoryid: parseInt(selectedCategory, 10)
            });
            alert("Serviço atualizado com sucesso!");
            navigate("/home");
        } catch (err) {
            console.error("Erro ao atualizar serviço:", err);
            alert("Ocorreu um erro ao atualizar o serviço.");
        }
    };

    if (!service) {
        return (
            <div className="edit-service">
                <h1>Carregando serviço...</h1>
            </div>
        );
    }

    return (
        <div className="edit-service">
            <div className="edit-service-form-grid">
                <h1>Editar Serviço</h1>
                <form onSubmit={handleSubmit}>

                    <TextField
                        label="Nome do Cliente"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={service.clientname}
                        InputProps={{ readOnly: true }}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Categoria</InputLabel>
                        <Select
                            labelId="category-label"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                        >
                            {categories.length === 0 ? (
                                <MenuItem value="" disabled>Nenhuma categoria disponível</MenuItem>
                            ) : (
                                categories.map((cat) => (
                                    <MenuItem key={cat.categoryid} value={cat.categoryid}>
                                        {cat.categorydescription}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

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

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "20px" }}
                    >
                        Salvar Alterações
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EditService;
