import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isInteger } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getData, getDateTime, isPath, Name } from "../../../utility/Functions";
import BackButton from "../../forms/backButton/BackButton";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { getEmployeeID } from "../../../utility/Session";
import { getAddedDate, getEndDate, getLeaveEndDate } from "../../../utility/DateTime";
import { ADD_LEAVE_DETAIL_OPTION } from "../../../utility/Route";

const AddLeaveDetailOption = () => {

    const display = isPath(ADD_LEAVE_DETAIL_OPTION);
    const history = useHistory();
    
    const initialValues = {
        name: "",
        leave_type: null,
    };
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [LeaveTypes, setLeaveTypes] = useState({});

    const fetchLeaveTypes = async () => {
        let response = await axios.get(getHost() + "/api/leave-types/");
        let { data } = response.data;
        setLeaveTypes(data);
    }

    useEffect(() => {
        if (display) {
            fetchLeaveTypes();
        } else {
            clearData();
        }
    }, [display]);

    const {
        name,
        leave_type,
    } = data;


    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;
        setData({ ...data, [id]: value });        
    }

    useEffect(() => {
        setData({ ...data, 
            duration: leave_type ? getData(parseInt(leave_type), "duration", LeaveTypes) : 0
        });
    }, [leave_type])

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

            if (!leave_type) {
                setDialogMessage("Please select a leave type.");
            } else {
                axios.post(getHost() + "/api/leave-detail-options/new/",{
                    name: name,
                    leave_type: leave_type
                }).then(res => {
                    setDialogMessage(res.data.message, res.status)
                }).catch(err => {
                    setDialogMessage(err.response.data.message)
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
                                    text="Leave Application"
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
                                        required
                                        id="name"
                                        type="text"
                                        label="Leave Detail Option"
                                        value={name}
                                        onChange={handleInputChange}
                                    />
                                    <Select 
                                        required
                                        id="leave_type" 
                                        label="Leave Type" 
                                        value={leave_type}
                                        options={LeaveTypes} 
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

export default AddLeaveDetailOption;