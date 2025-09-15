import React, { useState, useEffect } from "react";
import api from "../../../Services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import { Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

function extractArray(data) {
  // Normaliza os formatos mais comuns vindos da API para um array
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;        // ex.: { data: [...] }
  if (Array.isArray(data.rows)) return data.rows;        // ex.: { rows: [...] }
  if (Array.isArray(data.clients)) return data.clients;  // ex.: { clients: [...] }
  if (Array.isArray(data.categories)) return data.categories;
  if (Array.isArray(data.list)) return data.list;
  // tenta extrair o primeiro array encontrado em um objeto
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) return v;
  }
  return [];
}

function formatSQLDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function CreateService() {
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [clientsRes, categoriesRes] = await Promise.all([api.get("/client"), api.get("/category")]);
        console.log("GET /client response:", clientsRes.data);
        console.log("GET /category response:", categoriesRes.data);

        const clientsArray = extractArray(clientsRes.data);
        const categoriesArray = extractArray(categoriesRes.data);

        if (mounted) {
          setClients(clientsArray);
          setCategories(categoriesArray);
        }
      } catch (err) {
        console.error("Erro ao carregar clients/categories:", err);
      }
    }
    load();
    return () => { mounted = false; };
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

    const formattedDate = formatSQLDate(serviceDate);

    try {
      await api.post("/service", {
        serviceclientid: selectedClient,
        servicedate: formattedDate,
        servicecategoryid: parseInt(selectedCategory, 10),
      });
      alert("Serviço criado com sucesso!");
      navigate("/home");
    } catch (err) {
      console.error("Erro ao criar serviço:", err);
      alert("Ocorreu um erro ao criar o serviço.");
    }
  };

  return (
    <div className="create-service">
      <div className="create-service-form-grid">
        <h1>Criar Novo Serviço</h1>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="client-label">Cliente</InputLabel>
            <Select
              labelId="client-label"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              {clients.length === 0 ? (
                <MenuItem value="" disabled>Nenhum cliente disponível</MenuItem>
              ) : (
                clients.map((client) => (
                  <MenuItem key={client.clientid ?? client.id} value={client.clientid ?? client.id}>
                    {client.clientname ?? client.name ?? "Cliente sem nome"}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

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
                  <MenuItem key={cat.categoryid ?? cat.id} value={cat.categoryid ?? cat.id}>
                    {cat.categorydescription ?? cat.description ?? "Categoria sem descrição"}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
            <DatePicker label="Data" value={selectedDate} onChange={(date) => setSelectedDate(date)} format="dd/MM/yyyy" />
            <TimePicker label="Horário" value={selectedTime} onChange={(time) => setSelectedTime(time)} />
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
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
