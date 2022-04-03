import { getHost } from "../../../../../../../../utility/APIService";
import Select from "../../../../../../../forms/select/Select";
import Input from "../../../../../../../forms/input/Input";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import SubmitButton from "../../../../../../../forms/submitButton/SubmitButton";
import CancelButton from "../../../../../../../forms/cancelButton/CancelButton";
import Button from "../../../../../../../forms/button/Button";
import DialogBox from "../../../../../../../forms/dialogBox/DialogBox";
import { NameExtensions } from "../../../../../../../../utility/Constants";
import { getEmployeeID } from "../../../../../../../../utility/Session";

export default function Spouse(props){

    const [isEditable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [data, setData] = useState([]);
    const disabled = isEditable ? false : true;

    const fetchData = async () => {
        try {
            const response = await axios.get(getHost() + "/api/spouses/get/" + getEmployeeID() + "/");
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
        buss_name,
        buss_addr,
        tel_no,
        occupation,
        name_extension,
        sur_name,
        first_name,
        middle_name,
    } = data;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Spouse </span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                    </h1>
                    <Button 
                        text="edit"
                        display={!isEditable}
                        onClick={() => setEditable(true)} 
                    />
                    <CancelButton 
                        text="cancel" 
                        display={isEditable}
                        onClick={() => {
                            fetchData();
                            setMessage("");
                            setEditable(false);
                        }} 
                    />
                    <SubmitButton 
                        text={isSuccess ? "Ok" : "Save"}
                        display={isEditable} 
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <DialogBox 
                        message={message} 
                        isSuccess={isSuccess}
                        onClose={() => setMessage("")}
                    />
                    <Input 
                        required
                        label="surname"
                        type="text" 
                        id="sur_name" 
                        value={sur_name} 
                        disabled={disabled}
                        placeholder="Surname" 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        required
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
                        id="middle_name" 
                        value={middle_name} 
                        disabled={disabled}
                        placeholder="Middle Name" 
                        onChange={handleInputChange} 
                    />
                    <Select 
                        label="name extension" 
                        id="name_ext" 
                        value={name_extension}  
                        disabled={disabled}
                        options={NameExtensions} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="occupation"
                        type="text" 
                        id="occupation" 
                        value={occupation} 
                        disabled={disabled}
                        placeholder="Occupation" 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="employer bussiness name"
                        type="text" 
                        id="buss_name" 
                        value={buss_name} 
                        disabled={disabled}
                        placeholder="Employer Bussiness Name" 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="employer tel. no."
                        type="text" 
                        id="tel_no" 
                        value={tel_no} 
                        disabled={disabled}
                        placeholder="Employer Tel. No." 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="employer bussiness address"
                        type="text" 
                        id="buss_addr" 
                        value={buss_addr} 
                        disabled={disabled}
                        placeholder="Employer Bussiness Address" 
                        onChange={handleInputChange} 
                    />
                </div>
            </div>
        </form>
    )    
}