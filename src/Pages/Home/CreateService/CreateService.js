import React, { useState, useEffect } from "react";
import api from "../../../Services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import "./createService.css"
import { Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";


function CreateService() {
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/client")
      .then((res) => setClients(res.data.list ?? res.data.clients ?? []))
      .catch((err) => console.error("Erro ao carregar clientes:", err));

    api.get("/category")
      .then((res) => setCategories(res.data.list ?? res.data.categories ?? []))
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient || !selectedCategory) {
      alert("Selecione cliente e categoria.");
      return;
    }

    const serviceDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      selectedTime.getSeconds ? selectedTime.getSeconds() : 0
    );

    const pad = (n) => String(n).padStart(2, "0");
    const formattedDate = `${serviceDate.getFullYear()}-${pad(serviceDate.getMonth() + 1)}-${pad(serviceDate.getDate())} ${pad(serviceDate.getHours())}:${pad(serviceDate.getMinutes())}:${pad(serviceDate.getSeconds())}`;

    try {
      await api.post("/service", {
        serviceclientid: selectedClient,
        servicedate: formattedDate,
        servicecategoryid: parseInt(selectedCategory, 10),
      });
      navigate("/home");
    } catch (err) {
      console.error("Erro ao criar serviço:", err);
      alert("Erro ao criar serviço.");
    }
  };

  return (
    <div className="create-service">
      <div className="create-service-form-grid">
        <h1>Criar Novo Serviço</h1>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="client-label" sx={{ color: "white" }} shrink>
              Cliente
            </InputLabel>
            <Select className="select-client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              {clients.length === 0 ? (
                <MenuItem value="" disabled>Nenhum cliente disponível</MenuItem>
              ) : (
                clients.map((client) => (
                  <MenuItem key={client.clientid} value={client.clientid}>
                    {client.clientname}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label" sx={{ color: "white" }} shrink>Categoria</InputLabel>
            <Select className="select-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              {categories.length === 0 ? (
                <MenuItem value="" disabled>Nenhuma categoria disponível</MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat.categoryid} value={cat.categoryid}>
                    {cat.categorydescription} — R$ {cat.categoryvalue}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
            <DatePicker label="Data" value={selectedDate} onChange={(date) => setSelectedDate(date)} format="dd/MM/yyyy" 
              className= "custom-date-picker"
              slotProps={{
                textField: {
                  id: "date-picker-id"
                },
              }}
            />
            <TimePicker label="Horário" value={selectedTime} onChange={(time) => setSelectedTime(time)} 
              className= "custom-date-picker"
              slotProps={{
                textField: {
                  id: "date-picker-id"
                },
              }}
            />
          </LocalizationProvider>

          <Button
            className="create-service-button"
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedClient || !selectedCategory}
          >
            Salvar Serviço
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateService;
