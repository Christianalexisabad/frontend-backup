import { hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";

import "./Style.css";

const EditOfficeSupplyType = () => {

    const display = pathContains("/pages/settings/office%20supply%20types/edit/");
    const history = useHistory();
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const { id } = useParams();

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-types/get/" + id + "/");
        const { data } = await response.data;
        setData(data);
    }

    useEffect(() => {
       display ? fetchData() : setMessage("");
    }, [display]);

    const { name }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            fetchData();
            setMessage("");
            setSuccess(false);
        } else {
            if (!name) {
                setDialogMessage("Please enter a name.");
            }else if (hasIllegalCharacters(name)) {
                setDialogMessage("Name contains invalid characters.");
            } else {
                axios.patch(getHost() + "/api/office-supply-types/update/" + id + "/", {
                    name: name
                }).then(res => {  
                    setDialogMessage(res.data.message, res.status);
                }).catch(err => {
                    setDialogMessage(err.response.data.message);
                })
            }
        }
    }

    return (
        display &&
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Edit Type"
                                    onClick={() => {
                                        setMessage("");
                                        setData(initialData);
                                        history.goBack();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="content">
                                <form onSubmit={handleSubmit}>
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                    <Input 
                                        id="name"
                                        label="Type" 
                                        type="text" 
                                        value={name}
                                        placeholder="Name" 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <SubmitButton text={isSuccess ? "Ok" : "Save"} /> 
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div> 
    )
}

export default EditOfficeSupplyType;