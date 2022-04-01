import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { hasIllegalCharacters, isValidLeaveDuration } from "../../../utility/Regex";
import { pathContains } from "../../../utility/Functions";
import { useHistory, useParams } from "react-router-dom";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { EDIT_LEAVE_TYPE } from "../../../utility/Route";
import Select from "../../forms/select/Select";

const EditLeaveType = () => {

    const display = pathContains(EDIT_LEAVE_TYPE);
    const { id } = useParams();
    const history = useHistory();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/leave-types/get/"+ id + "/");
        const { data } = await response.data;
        setData(data);
    }

    useEffect(() => {
        if (display) {
            fetchData();
            setSuccess(false);
        } else {
            setMessage("");
            setSuccess(false);
        }
    }, [display]);

    const { 
        name,
        duration,
     }= data;

    useEffect(() => {
        setMessage(!isValidLeaveDuration(duration) ? "Invalid Duration value" : "");
    }, [duration])


    function setDialogMessage (message, status) {
        setMessage(message);     
        setSuccess(status);
        return status;
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            fetchData();
            setMessage("")
            setSuccess(false);
        } else {
            if (!name) {
                setDialogMessage("Please enter a name.");
            } else {
                axios.patch(getHost() + "/api/leave-types/update/" + id + "/", {
                    name: name,
                    duration: duration,
                }).then(res => {  
                    setDialogMessage(res.data.message, true);
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
                                    text="Edit Leave Type"
                                    onClick={() => {
                                        setMessage("");
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
                                        label="Leave Type" 
                                        type="text" 
                                        value={name}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="duration"
                                        label="duration in days" 
                                        type="text" 
                                        value={duration}
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Reset" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                fetchData();
                                            }}
                                        />
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

export default EditLeaveType;