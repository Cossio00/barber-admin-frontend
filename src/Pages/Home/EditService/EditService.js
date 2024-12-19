import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editService.css";
import api from "../../../Services/api";

function EditService() {

    const { serviceId } = useParams();

    const [ service, setService ] = useState(null); 

    useEffect(() => {
        api
            .get(`/service-agenda/${serviceId}`, {
            })
            .then((response) => {
                setService(response.data);
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro: " + err);
            });
    }, [serviceId]);


    return(
    <div className= "edit-service">
            <div>
                <div className="header-container">
                    <h1 colSpan="2">Editar Serviço</h1>
                </div>
                <div className= "edit-service-form-grid">
                    <table>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th className="clientName">Cliente</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    )
}



export default EditService;