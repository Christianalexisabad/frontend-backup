import { hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_BARANGAY } from "../../../utility/Route";

const AddBarangay = (props) => {

    const history = useHistory();
    const display = isPath(ADD_BARANGAY);

    const initialValues = {
        name: "",
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const { 
        name
     }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setData(initialValues);
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
            }else if (hasIllegalCharacters(name)) {
                setDialogMessage("Name contains invalid characters.");
            } else {
                axios.post(getHost() + "/api/barangays/new/", {
                    name: name
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
                                    text="Add Barangay"
                                    onClick={() => {
                                        setMessage("");
                                        setData(initialValues);
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
                                        placeholder="Name " 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialValues);
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

export default AddBarangay;