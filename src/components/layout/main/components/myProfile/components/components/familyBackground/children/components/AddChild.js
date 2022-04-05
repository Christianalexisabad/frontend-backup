import { hasIllegalCharacters } from "../../../../../../../../../../utility/Regex";
import CancelButton from "../../../../../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../../../../../forms/submitButton/SubmitButton";
import DialogBox from "../../../../../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../../../../../utility/APIService";
import React, { useState } from "react";
import Input from "../../../../../../../../../forms/input/Input";
import axios from "axios";
import "./AddChild.css";
import { getEmployeeID } from "../../../../../../../../../../utility/Session";
import { getCurrentDate } from "../../../../../../../../../../utility/DateTime";
import CloseButton from "../../../../../../../../../forms/closeButton/CloseButton";

const initialData = {
    full_name: "",   
    birthdate: "", 
}

const AddChild = (props) => {

    // const history = useHistory();
    const employee = getEmployeeID();

    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    
    const { full_name, birthdate }= data;

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        if (id === "birthdate" && getCurrentDate() < value ){
            setDialogMessage("Invalid birthdate");
        }

        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

            if (!full_name) {
                setDialogMessage("Please enter a full_name.");
            }else if (hasIllegalCharacters(full_name)) {
                setDialogMessage("Name contains invalid characters.");
            }else if (getCurrentDate() < birthdate ){
                setDialogMessage("Invalid birthdate");
            }else if (!birthdate) {
                setDialogMessage("Please select a birthdate.");
            } else {
                axios.post(getHost() + "/api/childrens/new/", {
                    full_name: full_name,
                    birthdate: birthdate,
                    employee: employee,
                    created_at: getCurrentDate(),
                }).then(res => {  
                    setDialogMessage(res.data.message, res.status);
                }).catch(err => {
                    setDialogMessage(err.response.data.message);
                })
            }
    }

    const handleReset = (event) => {
        event.preventDefault();
        setData(initialData);
    }

    const handleClose = (event) => {
        event.preventDefault();
        props.onClose();
    }

    return (
        <div className="AddChild">
            <div className="container bg-white">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="header w-100 text-end">
                            <CloseButton 
                                onClick={handleClose} 
                            />
                        </div>
                        <div className="content">
                            <form onSubmit={handleSubmit}>
                                <DialogBox 
                                    message={message} 
                                    isSuccess={isSuccess}
                                    onClose={() => setMessage("")}
                                />
                                <Input 
                                    id="full_name"
                                    label="Full Name" 
                                    type="text" 
                                    value={full_name}
                                    placeholder="Full Name" 
                                    onChange={handleInputChange} 
                                />
                                    <Input 
                                    id="birthdate"
                                    label="birthdate" 
                                    type="date" 
                                    value={birthdate}
                                    placeholder="Birthdate" 
                                    onChange={handleInputChange} 
                                />
                                <div className="btnContainer">
                                    <CancelButton 
                                        text="Reset" 
                                        onClick={handleReset} 
                                    /> 
                                    <SubmitButton 
                                        text="Save" 
                                    /> 
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default AddChild;