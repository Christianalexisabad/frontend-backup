import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isDecimal } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name } from "../../../utility/Functions";
import BackButton from "../../forms/backButton/BackButton";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";

const AddMeasurementUnit = () => {

    const display = isPath("/pages/inventory%20settings/measurement%20units/new/");
    const history = useHistory();

    const initialData = {
        name: "",
        description: ""
    }
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const { name, description } = data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setData(initialData);
        setSuccess(false);
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

            if (!name) {
                setDialogMessage("Please enter a name.");
            }else if (!description) {
                setDialogMessage("Please enter a description.");
            } else {
                axios.post(getHost() + "/api/measurement-units/new/", {
                    name: name,
                    description: description
                }).then(res => {  
                    setDialogMessage(res.data.message, res.status);
                }).catch(err => {
                    setDialogMessage(err.response.data.message);
                })
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
                                    text="Add Measurement Unit"
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
                                        label="Name" 
                                        type="text" 
                                        value={name}
                                        placeholder="Name" 
                                        onChange={handleInputChange} 
                                        onClick={() => setData({ ...data, name: "" })}
                                    />
                                    <Input 
                                        id="description"
                                        label="description" 
                                        type="text" 
                                        value={description}
                                        placeholder="description" 
                                        onChange={handleInputChange} 
                                        onClick={() => setData({ ...data, description: "" })}
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialData);
                                            }}
                                        />
                                        <SubmitButton text="Save" /> 
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

export default AddMeasurementUnit;