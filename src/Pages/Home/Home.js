import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import api from "../../Services/api";
import "./home.css";
//import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";


function Home() {

    const [ service, setService ] = useState([]); 
    const [ agendaDate, setAgendaDate ] = useState(new Date());
    
    const title = isToday(agendaDate) ? "Agenda de Hoje" : `Agenda de ${formatDate(agendaDate)}`;    
    
    useEffect(() => {
        api
            .post("/service-agenda", {
                date: `${agendaDate.getFullYear()}-${agendaDate.getMonth()+1}-${agendaDate.getDate()}`
            })
            .then((response) => {
                setService(response.data.services);
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro: " + err);
            });
    }, [agendaDate]);

    const listElements = service.map((element) => {
        const horario = new Date(element.servicedate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
            return(
                    <tbody>
                        <tr key={element.serviceid}>
                            <th className="serviceDate">{horario}</th>
                            <th className="clientName">{element.clientname}</th>
                            <th className="serviceStatus">OK</th>
                            <th className="serviceActions">
                                <ion-icon className="editService" name="pencil-outline"></ion-icon>
                                <ion-icon className="deleteService" name="close-outline"></ion-icon>
                            </th>
                        </tr>  
                    </tbody>          
            )})

    return(
        <div className= "home">
            <div className= "agenda-grid">
                <div className="header-container">
                    <h1></h1>
                    <input type="button" value="Agendar"></input>
                </div>
                <div className="header-container">
                    <h1>{title}</h1>
                    <DatePicker label="Basic date picker" value={agendaDate} onChange={(date) => setAgendaDate(date)} locale="pt-br" format="dd/MM/yy"/>
                </div>
                <div className= "agenda-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th className="clientName">Cliente</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                            {service.length > 0 ? listElements : (
                            <tbody>
                                <tr>
                                <th colSpan="4">Nenhum serviço agendado para esta data.</th>
                            </tr>
                            </tbody>
                            )}
                            {/*<Dialog open={false}>
                                <DialogTitle></DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Deseja remover este serviço da agenda?</DialogContentText>
                                </DialogContent>
                            </Dialog>*/}
                    </table>
                </div>
            </div>
        </div>
        
    )
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é indexado a partir de 0
    return `${day}/${month}`;
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

export default Home;