import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import { TextField, Button } from "@mui/material";

function EditCategory() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({ categorydescription: "", categoryvalue: "" });

    useEffect(() => {
        api.get("/category")
            .then((res) => {
                const data = res.data.list ? res.data.list() : res.data;
                const cat = data.find((c) => String(c.categoryid) === String(categoryId));
                if (cat) setCategory(cat);
            })
            .catch((err) => console.error(err));
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/category/${categoryId}`, category);
            alert("Categoria atualizada!");
            navigate("/category");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="edit-category">
            <h1>Editar Categoria</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Descrição"
                    value={category.categorydescription}
                    onChange={(e) => setCategory({ ...category, categorydescription: e.target.value })}
                    required
                    style={{ marginRight: "10px" }}
                />
                <TextField
                    label="Valor"
                    type="number"
                    value={category.categoryvalue}
                    onChange={(e) => setCategory({ ...category, categoryvalue: e.target.value })}
                    required
                    style={{ marginRight: "10px" }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Salvar
                </Button>
            </form>
        </div>
    );
}

export default EditCategory;
