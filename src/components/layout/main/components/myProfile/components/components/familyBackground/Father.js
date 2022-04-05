import Select from "../../../../../../../forms/select/Select";
import DialogBox from "../../../../../../../forms/dialogBox/DialogBox";
import Input from "../../../../../../../forms/input/Input";
import React, { useEffect, useState } from "react";
import Button from "../../../../../../../forms/button/Button";
import CancelButton from "../../../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../../../forms/submitButton/SubmitButton";
import axios from "axios";
import { getHost } from "../../../../../../../../utility/APIService";
import { NameExtensions } from "../../../../../../../../utility/Constants";
import { getEmployeeID } from "../../../../../../../../utility/Session";

export default function Father(props){

    const [isEditable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [data, setData] = useState([]);


    const fetchData = async () => {
        try {
            const response = await axios.get(getHost() + "/api/fathers/get/" + getEmployeeID() + "/");
            const { data } = await response.data;
            setData(data);
        } catch (error) {
            error.response.status = 404 && console.clear();
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    
    const {
        first_name,
        sur_name,
        middle_name,
        name_extension,
    } = data;

    const disabled = !isEditable;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        fetchData();
        setMessage("");
        setEditable(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="text-secondary">
                            <span>Father </span>
                            <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                        </h1>
                        <DialogBox
                            message={ message } 
                            isSuccess={ isSuccess }
                        />
                        <Button 
                            text="edit"
                            display={!isEditable}
                            onClick={() => setEditable(true)} 
                        />
                        <CancelButton 
                            text="cancel" 
                            display={isEditable}
                            onClick={handleCancel} 
                        />
                        <SubmitButton 
                            text={isSuccess ? "Ok" : "Save"}
                            display={isEditable} 
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Input  
                            label="surname"
                            type="text" 
                            id="sur_name" 
                            value={sur_name} 
                            disabled={disabled}
                            placeholder="Surname" 
                            onChange={handleInputChange} 
                        />
                        <Input  
                            label="first name"
                            type="text" 
                            id="first_name" 
                            value={first_name} 
                            disabled={disabled}
                            placeholder="First Name" 
                            onChange={handleInputChange} 
                        />
                        <Input  
                            label="middle name"
                            type="text" 
                            id="middle name" 
                            value={middle_name} 
                            disabled={disabled}
                            placeholder="Middle Name" 
                            onChange={handleInputChange} 
                        />
                        <Select 
                            label="name extension" 
                            id="name_extension" 
                            value={name_extension}  
                            options={NameExtensions} 
                            disabled={disabled}
                            onChange={handleInputChange} 
                        />
                    </div>        
                </div>
            </form>
        </div>
    )   
}