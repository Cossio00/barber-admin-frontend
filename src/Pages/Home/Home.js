import React, { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { ptBR } from "date-fns/locale";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import api from "../../Services/api";
import "./home.css";
import { Dialog, DialogContent, DialogContentText, Button, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";


function Home() {

    const [ service, setService ] = useState([]); 
    const [ agendaDate, setAgendaDate ] = useState(new Date());
    const [ open, setOpen ] = useState(false)
    const [ serviceID, setServiceID ] = useState("");
    
    const navigate = useNavigate();

    const handleEdit = (serviceId) => {
        navigate(`/edit-service/${serviceId}`);
    };

    const handleClickOpen = (id) => {
        setOpen(true);
        setServiceID(id);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (id) => {
        api
            .delete(`/service/${id}`)
            .then((response) => {
                console.log(response.status);
                handleClose();
                setService((prevItems) => prevItems.filter((item) => item.serviceid !== id));
                setServiceID("");
            }).catch((err) => {
                console.error("ops! ocorreu um erro: " + err);
            });
    }

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

    const totalValue = service.reduce(
        (acc, item) => acc + Number(item.categoryvalue || 0),
        0
    );

    const listElements = service.map((element) => {
        const horario = new Date(element.servicedate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
            return(
                    <tbody>
                        <tr>
                            <th className="serviceDate">{horario}</th>
                            <th className="clientName">{element.clientname}</th>
                            <th className="serviceDescription">{element.servicecategory}</th>
                            <th className="serviceValue">{element.categoryvalue}</th>
                            <th className="serviceStatus">OK</th>
                            <th className="serviceActions">
                                <ion-icon className="editService" name="pencil-outline" onClick={() => handleEdit(element.serviceid)}></ion-icon>
                                <ion-icon className="deleteService" name="close-outline" onClick={() => handleClickOpen(element.serviceid)}></ion-icon>
                            </th>
                        </tr>  
                    </tbody>          
            )})

    return(
        <div className= "home">
            <div className= "agenda-grid">
                <div className="header-container">
                    <input colSpan="2" type="button" value="Agendar"  onClick={() => navigate("/create-service")}></input>
                </div>
                <div className="header-container">
                    <h1>{title}</h1>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                        <DatePicker  label="Data" value={agendaDate} onChange={(date) => setAgendaDate(date)} locale="pt-br" format="dd/MM/yy"
                            className= "custom-date-picker"
                        />
                    </LocalizationProvider>
                </div>
                <div className= "agenda-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th className="clientName">Cliente</th>
                                <th>Serviço</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                            {service.length > 0 ? listElements : (
                            <tbody>
                                <tr>
                                <th colSpan="6">Nenhum serviço agendado para esta data.</th>
                            </tr>
                            </tbody>
                            )}

                            {service.length > 0 && (
                                <tfoot>
                                    <tr>
                                        <th colSpan="3" style={{ textAlign: "right" }}>Total</th>
                                        <th className="totalValue">{totalValue}</th>
                                    </tr>
                                </tfoot>
                            )}
                            {<Dialog open={open}>
                                <DialogContent>
                                    <DialogContentText>Deseja remover este serviço da agenda?</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={()=> handleDelete(serviceID)}>Sim</Button>
                                    <Button onClick={handleClose}>Não</Button>
                                </DialogActions>
                            </Dialog>}
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