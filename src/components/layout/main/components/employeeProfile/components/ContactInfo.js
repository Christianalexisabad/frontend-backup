import DialogBox from "../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../utility/APIService";
import React, { useState, useEffect, useCallback } from "react";
import Input from "../../../../../forms/input/Input";
import axios from "axios";
import Button from "../../../../../forms/button/Button";
import CancelButton from "../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../forms/submitButton/SubmitButton";
import { useParams } from "react-router-dom";

export default function ContactInfo(props){

    const { employee, tab } = useParams();
    const display = tab === "contact information" ? true : false;

    const HOST = getHost();
    const [data, setData] = useState({});
    const [isEditable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employees/" + employee + "/contact-info/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {

        if (display){
            fetchData();
        }

    }, [ display, fetchData ])


    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });
    }

    const { id, mobile_no, email, tel_no } = data;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSuccess) {
            setMessage("");
            setSuccess(false);
        } else {
            axios.patch(HOST + "/api/employees/update/" + id + "/", {
                mobile_no: mobile_no,
                email: email,
                tel_no: tel_no,
            })
            .then(res => {
                setMessage(res.data.message);
                setSuccess(true);
                setEditable(false);
            }).catch(err => {
                setMessage(err.response.data.message);
            })
        }
    }

    return (
        display &&
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Contact Information </span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                    </h1>
                    <Button 
                        text="edit"
                        permission="can_edit_employee"
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
                        id="email" 
                        label="email"
                        value={email} 
                        disabled={!isEditable}
                        onChange={handleInputChange} 
                    />
                    <Input 
                        id="mobile_no" 
                        label="mobile no"
                        value={mobile_no} 
                        disabled={!isEditable}
                        onChange={handleInputChange} 
                    />
                    <Input 
                        validate
                        id="tel_no" 
                        label="tel no"  
                        value={tel_no} 
                        disabled={!isEditable}
                        onChange={handleInputChange} 
                    />
                </div>
            </div>
        </form>
    )   
}