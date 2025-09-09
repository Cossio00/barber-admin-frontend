import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editService.css";
import api from "../../../Services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import { TextField } from "@mui/material";


function EditService() {

    const { serviceId } = useParams();

    const [ service, setService ] = useState(null); 
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

  
    useEffect(() => {
        api
            .get(`/service-agenda/${serviceId}`, {
            })
            .then((response) => {
                setService(response.data);
                const parsedDate = new Date(response.data.servicedate);
                
                const dateOnly = new Date(
                    parsedDate.getFullYear(),
                    parsedDate.getMonth(),
                    parsedDate.getDate()
                  );
                  setSelectedDate(dateOnly);
              
                  // Apenas o horário
                  const timeOnly = new Date(
                    0, // Ano fictício
                    0, // Mês fictício
                    0, // Dia fictício
                    parsedDate.getHours(),
                    parsedDate.getMinutes()
                  );
                  setSelectedTime(timeOnly);
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro: " + err);
            });
    }, [serviceId]);

    if(service !== null){
        return(
        <div className= "edit-service">
                <div colSpan="2">
                    <div className="header-container">
                        <h1 colSpan="2">Editar Serviço</h1>
                    </div>
                    <div className= "edit-service-form-grid">
                        <form action="/submit" method="post">
                            
                            <TextField label="Nome do Cliente" variant="outlined" margin="normal" value={service.clientname || ""} readOnly="true"/>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                                <DatePicker label="Data" value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} format="dd/MM/yyyy"/>
                                <TimePicker label="Horário" value={selectedTime} onChange={(newTime) => setSelectedTime(newTime)}/>
                            </LocalizationProvider>

                        </form>
                    </div>
                </div>
            </div>
    )}
    else{
        return(
            <div className= "edit-service">
                <div colSpan="2">
                    <div className="header-container">
                        <h1 colSpan="2">Editar Serviço</h1>
                    </div>
                    <div className= "edit-service-form-grid">
                    </div>
                </div>
            </div>
    )}
    
}



export default EditService;