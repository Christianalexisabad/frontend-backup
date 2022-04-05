import Select from "../../../../../../../forms/select/Select";
import Input from "../../../../../../../forms/input/Input";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../../forms/button/Button";
import CancelButton from "../../../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../../../forms/submitButton/SubmitButton";
import axios from "axios";
import { getHost } from "../../../../../../../../utility/APIService";
import { ADD_NAME_EXTENSION } from "../../../../../../../../utility/Route";
import { useParams } from "react-router-dom";
import DialogBox from "../../../../../../../forms/dialogBox/DialogBox";
import { isDataChanged } from "../../../../../../../../utility/Functions";

export default function Father(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [isEditable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [data, setData] = useState([]);
    const [initialData, setInitialData] = useState({});
    
    const [NameExtensions, setNameExtensions] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/fathers/get/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
        setInitialData(data);
    }, [ HOST, employee ])

    const fetchNameExtensions = useCallback(async () => {
        const response = await axios.get(HOST + "/api/name-extensions/");
        const { data } = await response.data;
        setNameExtensions(data);
    }, [ HOST ])

    useEffect(() => {
        fetchNameExtensions();
        fetchData();
    }, [ fetchData, fetchNameExtensions ])  
    
    const {
        id,
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

    function postData () {
        axios.post(HOST + "/api/fathers/new/", {
            employee: employee,
            first_name: first_name,
            sur_name: sur_name,
            middle_name: middle_name,
            name_extension: name_extension
        }).then(res => {
            setMessage(res.data.message);
            setSuccess(true);
        }).catch(err => {
            console.log(err)
        })
    }

    function patchData () {
        axios.patch(HOST + "/api/fathers/update/" + id + "/", {
            first_name: first_name,
            sur_name: sur_name,
            middle_name: middle_name,
            name_extension: name_extension
        }).then(res => {
            setMessage(res.data.message);
            setSuccess(true);
        }).catch(err => {
            console.log(err)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSuccess) {
            setMessage("");
            setSuccess(false);
        } else {
            if (id) {
                patchData();
            } else {
                postData();
            }
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        if (!isDataChanged(initialData, data)) {
            setMessage("");
            setEditable(false);
        }
        setData(initialData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Father </span>
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
                    <DialogBox
                        message={message} 
                        isSuccess={isSuccess}
                        onClose={() => setMessage("")}
                    />
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
                        id="middle_name" 
                        value={middle_name} 
                        disabled={disabled}
                        placeholder="Middle Name" 
                        onChange={handleInputChange} 
                    />
                    <Select 
                        label="name extension" 
                        value={name_extension} 
                        id="name_extension" 
                        disabled={!isEditable}
                        options={NameExtensions} 
                        refresh={()=> fetchNameExtensions()}
                        createText="Add Name Extension"
                        create={ADD_NAME_EXTENSION}   
                        onChange={handleInputChange} 
                    />
                </div>        
            </div>
        </form>
    )   
}