import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { hasIllegalCharacters, isInteger } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";

const EditLeave = () => {

    const display = pathContains("/pages/self%20service/leave/edit/");
    const history = useHistory();
    const { id } = useParams();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [leave_types, setLeaveTypes] = useState({});
    const HOST = getHost();

    const fetchData = async () => {
        let response = await axios.get(HOST + "/api/leaves/get/"+ id + "/");
        let { data } = await response.data;
        setData(data);
    }

    const fetchLeaveTypes = async () => {
        let response = await axios.get(getHost() + "/api/leave-types/");
        let { data } = response.data;
        setLeaveTypes(data);
    }

    useEffect(() => {
        if (display) {
            fetchData();
            fetchLeaveTypes();
        } else {
            clearData();
        }
    }, [display]);

    const {
        leave_type,
        number_of_working_days,
        other_details,
        start_date,
        end_date,
    } = data;


    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setSuccess(false);
    }   

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {

            if (!leave_type) {
                setDialogMessage("Please select a leave type.");
            }else if (!other_details) {
                setDialogMessage("Please enter other details.");
            }else if (hasIllegalCharacters(other_details)) {
                setDialogMessage("Other details contains invalid characters.");
            }else if (!number_of_working_days) {
                setDialogMessage("No. of days is required.");
            }else if (!isInteger(number_of_working_days)) {
                setDialogMessage("Number of days must be a number.");
            }else if (!start_date || !end_date) {
                setDialogMessage("Please complete inclusive dates.");
            } else {
                axios.patch(getHost() + "/api/leaves/update/" + id +"/",{
                    "leave_type": leave_type,
                    "other_details": other_details,
                    "number_of_working_days": number_of_working_days,
                    "start_date": start_date,
                    "end_date": end_date,
                }).then(res => {
                    setDialogMessage(res.data.message, res.status)
                }).catch(err => {
                    setDialogMessage(err.response.data.message)
                })
            }
        }
    }

    return (
        display &&
        <div className="EditForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Leave Application"
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
                                    <Select 
                                        id="leave_type" 
                                        label="Leave Type" 
                                        value={leave_type}
                                        options={leave_types} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input
                                        id="other_details"
                                        type="text"
                                        label="Other details"
                                        value={other_details}
                                        placeholder="Other details"
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        id="number_of_working_days"
                                        type="text"
                                        label="Working Days Applied for"
                                        value={number_of_working_days}
                                        placeholder="Value must be a number and greater than one(1)"
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        type="date"
                                        id="start_date"
                                        label="start date"
                                        value={start_date}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        type="date"
                                        id="end_date"
                                        label="end date"
                                        value={end_date}
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

export default EditLeave;