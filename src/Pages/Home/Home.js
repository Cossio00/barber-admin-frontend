import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import api from "../../Services/api";
import "./home.css";

/*
const elementos = [
    {
        "id": "001askwmaioq12tt21",
        "cliente": "José",
        "horario": "18:00",
        "status": "OK"
    },
    {
        "id": "001askwmaioq12tt81",
        "cliente": "Mario",
        "horario": "18:30",
        "status": "OK"
    },
    {
        "id": "001askwmaioq12tt23",
        "cliente": "Luisa",
        "horario": "19:00",
        "status": "OK"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    },
    {
        "id": "0089skwmaioq12tt23",
        "cliente": "Luis",
        "horario": "19:40",
        "status": "Pendente"
    }
]
    */

function Agenda(props){
    const elements = props.elements.services;

    if (!elements || elements.length === 0) {
        return (
            <tbody>
                <tr>
                    <td colSpan="3">Nenhum serviço encontrado</td>
                </tr>
            </tbody>
        );
    }

    const listElements = elements.map((element) => {
        
        const horario = new Date(element.servicedate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        return(
            <tr key={element.serviceid}>
                <th>{horario}</th>
                <th className="clientName">{element.serviceclientid}</th>
                <th>OK</th>
            </tr>
        )
    })

    return (
            <tbody>{listElements}</tbody>
    )
}
    

function Home() {

    const [ service, setService ] = useState([]); 

    useEffect(() => {
        api
            .get("/service")
            .then((response) => {
                setService(response.data);
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro: " + err);
            });
    }, []);

    return(
        <div className= "home">
            <div className= "agenda-grid">
                <div className="header-container">
                    <h1>Agenda de hoje</h1>
                    <DatePicker label="Basic date picker" />
                </div>
                <div className= "agenda-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th className="clientName">Cliente</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <Agenda  elements={service} />
                    </table>
                </div>
            </div>
        </div>
        
    )
}

export default Home;