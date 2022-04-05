import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import {getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import Select from "../../forms/select/Select";
import axios from "axios";
import "./Style.css";
import { ADD_LEAVE_TYPE } from "../../../utility/Route";
import { isValidLeaveDuration } from "../../../utility/Regex";

const AddLeaveType = (props) => {

    const history = useHistory();

    const initialData = { 
        name: "",
        duration: "",
     };

    const display = isPath(ADD_LEAVE_TYPE);
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const { 
        name,
        duration,
     }= data;

    useEffect(() => {
        if (name){
            axios.get(getHost() + "/api/leave-types/verify/"+name+"/")
            .then((response) => {
                setMessage("");
            }).catch((err) => {
                setMessage(err.response.data.message)
            })
        }
    }, [name])

    useEffect(() => {
        setMessage(!isValidLeaveDuration(duration) ? "Invalid Duration value" : "");
    }, [duration])

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

        if (!name) {
            setDialogMessage("Please enter a name.");
        } else {
            axios.post(getHost() + "/api/leave-types/new/", {
                name: name,
                duration: duration,
            }).then(res => {  
                setDialogMessage(res.data.message, );
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
                                    text="Add Leave Type"
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
                                    />
                                    <Input 
                                        id="duration"
                                        label="duration in days" 
                                        type="text" 
                                        value={duration}
                                        placeholder="Duration" 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" isSuccess={isSuccess}
                                            onClick={() => {
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

export default AddLeaveType;