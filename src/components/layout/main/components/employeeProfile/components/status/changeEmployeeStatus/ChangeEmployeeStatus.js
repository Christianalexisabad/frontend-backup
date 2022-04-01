import CancelButton from "../../../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../../../forms/submitButton/SubmitButton";
import DialogBox from "../../../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import Input from "../../../../../../../forms/input/Input";
import Title from "../../../../../../../forms/title/Title";
import axios from "axios";
import "./ChangeEmployeeStatus.css";
import { getEmployeeID } from "../../../../../../../../utility/Session";
import Select from "../../../../../../../forms/select/Select";
import { getCurrentDate } from "../../../../../../../../utility/DateTime";

const ChangeEmployeeStatus = (props) => {

    // const history = useHistory();
    const modified_by = getEmployeeID();

    const initialValues = {
        status: props.status,
        employee: props.employee,
        reason: "",
        comment: "",
        effective_date: getCurrentDate(),
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    
    const [Statuses, setStatuses] = useState([]);
    // eslint-disable-next-line
    const [Employees, setEmployees] = useState([]);
    const [PositionID, setPositionID] = useState(null);

    const fetchEmployees = async () => {
        let response = await axios.get(getHost() + "/api/employees/");
        const { data } = await response.data;
        setEmployees(data);
    }

    const { 
        status,
        reason,
        comment,
        employee,
        effective_date
     }= data;

    const fetchStatuses = async () => {
        let response = await axios.get(getHost() + "/api/employee-statuses/");
        let { data } = await response.data;
        setStatuses(data);
    }

    const fetchPositionID = useCallback(async () => {
        let response = await axios.get(getHost() + "/api/employees/get-position-id/"+ employee +"/");
        let { data } = await response.data;
        setPositionID(data);
    }, [ employee ])

    useEffect(() => {
        fetchPositionID();
        fetchStatuses();
        fetchEmployees();
    }, [ fetchPositionID ]);

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

        if (!status || !reason || !comment) {
            setDialogMessage("Please complete the details above.");
            return false;
        } else {
            axios.patch(getHost() + "/api/employees/update/" + employee + "/", {
                employee_status: status,
            }).then(res => {  
                const s = parseInt(status);
                if(s === 3 || s ===5 ) {
                    deactivateUser();
                    updatePosition(1);
                }

                if (s === 1 || s === 2 || s === 4) {
                    activateUser();
                    updatePosition(0);
                } else {
                    updatePosition(1);
                }

                createEmployeeStatusHistory();
                setDialogMessage("Status Updated Successfully!", true);
            }).catch(err => {
                setDialogMessage(err.response.data.message);
            })
        }
    }

    function updatePosition(status){
        axios.patch(getHost() + "/api/positions/update/" + PositionID + "/", {
            is_vacant: status,
        }).then(res => { 
        }).catch(err => {
        })
    }

    function deactivateUser(){
        axios.patch(getHost() + "/api/users/deactivate/" + employee + "/");
    }

    function activateUser(){
        axios.patch(getHost() + "/api/users/activate/" + employee + "/");
    }

    function createEmployeeStatusHistory(){
        axios.post(getHost() + "/api/employee-status-histories/new/", {
            status: status,
            reason: reason,
            comment: comment,
            employee: employee,
            modified_by: modified_by,
            effective_date: effective_date,
        }).then(res => {  
        }).catch(err => {
        })
    }

    return (
        <div className="ChangeEmployeeStatus">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Change Employee Status"
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
                                        id="status" 
                                        label="status" 
                                        value={status} 
                                        options={Statuses}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="reason"
                                        label="reason"
                                        type="text" 
                                        value={reason}
                                        placeholder="Reason" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="comment"
                                        label="comment"
                                        type="text" 
                                        value={comment}
                                        placeholder="Comment" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="effective_date"
                                        label="effective date"
                                        type="text" 
                                        value={effective_date}
                                        onChange={handleInputChange} 
                                    />
                                   
                                    <div className="btnContainer text-center">
                                        <br />
                                        <CancelButton text="Cancel" onClick={() => {
                                            setMessage("");
                                            setData(initialValues);
                                            props.onClose();
                                        }}/>
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

export default ChangeEmployeeStatus;