import CancelButton from "../../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../../forms/submitButton/SubmitButton";
import { getData, isPath } from "../../../../../../../utility/Functions";
import DialogBox from "../../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
import Select from "../../../../../../forms/select/Select";
import { useHistory } from "react-router-dom";
import Input from "../../../../../../forms/input/Input";
import Title from "../../../../../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { getEmployeeID } from "../../../../../../../utility/Session";
import { getAddedDate, getCurrentDate } from "../../../../../../../utility/DateTime";
import { APPLY_LEAVE } from "../../../../../../../utility/Route";

const initialValues = {
    leave_type: "",
    other_details: "",
    days_applied: "",
    start_date: "",
    end_date: "",
    duration: 0,
};

const ApplyLeave = () => {

    const display = isPath(APPLY_LEAVE);
    const history = useHistory();
    const employee = getEmployeeID();
    const currentDate = getCurrentDate();  
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [LeaveTypes, setLeaveTypes] = useState({});

    const fetchSex = useCallback(async () => {
        let response = await axios.get(getHost() + "/api/employees/get/"+ employee +"/");
        let { sex } = await response.data;
        fetchLeaveTypes(sex);
    }, [ employee ])

    const fetchLeaveTypes = async (sex) => {
        let response = await axios.get(getHost() + "/api/leave-types/sex="+sex+"/");
        let { data } = response.data;
        setLeaveTypes(data);
    }

    useEffect(() => {
        if (display) {
            fetchSex();
        } else {
            setMessage("");
            setSuccess(false);
        }
    }, [ fetchSex, display ]);

    const {
        leave_type,
        days_applied,
        other_details,
        start_date,
        end_date,
        duration,
    } = data;

    const [available, setAvailable] = useState(duration);

    const fetchAvailableLeave = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/leave-balances/get/employee=" + employee + "/leave_type=" + leave_type + "/");
        const { data } = await response.data;
        setAvailable(data);
    }, [ employee, leave_type ])

    const handleInputChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        setData({ ...data, [id]: value });        
    }

    useEffect(() => {

        if (leave_type) {
            fetchAvailableLeave(employee, leave_type);
            setData({ 
                ...data, 
                duration: getData(parseInt(leave_type), "duration", LeaveTypes)
            });
        } 

    }, [ leave_type, data, LeaveTypes, employee, fetchAvailableLeave ])

    useEffect(() => {
        if (start_date && days_applied) {
            setData({ ...data, end_date: getAddedDate(start_date, parseInt(days_applied))});
        }   
    }, [ start_date, days_applied, data ])

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

        if (isSuccess) {
            clearData();
        } else {

            if (!leave_type) {
                setDialogMessage("Please select a leave type.");
            }else if (!days_applied) {
                setDialogMessage("Please specify days_applied applied for.");
            }else if (days_applied && (days_applied <= 0 || parseInt(days_applied) > parseInt(duration))) {
                setDialogMessage("Days applied for is out of range.");
            }else if (!start_date) {
                setDialogMessage("Please select a start date.");
            } else {
                axios.post(getHost() + "/api/employee-leaves/new/",{
                    leave_type: leave_type,
                    other_details: other_details,
                    days_applied: days_applied,
                    start_date: start_date,
                    end_date: end_date,
                    employee: employee,
                    application_date: currentDate,
                }).then(res => {
                    createLeaveBalance();
                    setDialogMessage(res.data.message, res.status)
                }).catch(err => {
                    setDialogMessage(err.response.data.message)
                })
            }
        }
    }
    
    function createLeaveBalance(){
        const balance = {
            leave_type: leave_type,
            employee: employee,
            available: available,
        }

        axios.post(getHost() + "/api/leave-balances/new/", balance)
        .then(res => {
        }).catch(err => {
        })
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
                                    <Select 
                                        required
                                        id="leave_type" 
                                        label="Leave Type" 
                                        value={leave_type}
                                        options={LeaveTypes} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input
                                        type="text"
                                        label="applicable leave/duration"
                                        disabled={true}
                                        value={duration}
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
                                        required
                                        id="days_applied"
                                        type="number"
                                        label="Working Days Applied for"
                                        value={days_applied}
                                        disabled={leave_type ? false : true}
                                        placeholder="Value must be a number"
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        required
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
                                        disabled={true}
                                        placeholder="End Date"
                                    />
                                    <div className="btnContainer">
                                        {!isSuccess && <CancelButton 
                                            text="Clear" 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialValues);
                                            }}
                                        />}
                                        <SubmitButton text={isSuccess ? "New" : "Submit"} /> 
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

export default ApplyLeave;