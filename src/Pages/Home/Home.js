import React from "react";
import "./home.css";


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

function Agenda(props){
    const elements = props.elements;
    
    const listElements = elements.map((element) => 
        <tr key={element.id}>
            <th>{element.horario}</th>
            <th className="clientName">{element.cliente}</th>
            <th>{element.status}</th>
        </tr>
    )

    return (
        <tbody>{listElements}</tbody>
    )
}

function Home() {
    return(
        <div className= "home">
            <div className= "agenda-grid">
                <h1>Agenda de hoje</h1>
                <div className= "agenda-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th className="clientName">Cliente</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <Agenda  elements={elementos}></Agenda>
                    </table>
                </div>
            </div>
        </div>
        
    )
}

export default Home;