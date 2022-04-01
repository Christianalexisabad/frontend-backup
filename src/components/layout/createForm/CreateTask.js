import { hasIllegalCharacters } from "../../../utility/Regex";
import { isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import Button from "../../forms/button/Button";
import { useHistory } from "react-router-dom";
import { getEmployeeID } from "../../../utility/Session";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";

const CreateTask = () => {

    const history = useHistory();
    const display = isPath("/pages/self%20service/tasks/new/");

    const initialValues = {
        employee: "",
        task:"",
        start_date:"",
        end_date:"",
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
  
    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/job-histories/employees/supervisor=" + getEmployeeID() + "/");
        const { data } = await response.data;
        setEmployees(data);
    }

    useEffect(() => {
        if (display) {
            fetchEmployees();
        } else {
            clearData();
        }
    }, [display]);

    const {
        employee,
        task,
        start_date,
        end_date,
    } = data;

    function getName(id) {
        try {
            for (const item of employees) {
                if (item.id === parseInt(id)) {
                    return item.employee_name;   
                }
            }       
        } catch (error) {
            return null;
        }
        return null;
    }

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        if (id === "employee") {
            setEmployeeName(getName(value))
        }
        
        setData({ ...data, [id]: value, message: "" });
    }

    const handleClearInput = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: ""});        
    }
    function clearData () {
        setMessage("");
        setEmployeeName("");
        setData(initialValues);
        setSuccess(false);
    }   

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
            if (!employee) {
                setMessage("Please select an employee.");
            }else if (!task) {
                setMessage("Task is missing.");
            }else if (hasIllegalCharacters(task)) {
                setMessage("Task contains invalid characters.");
            }else if (!start_date) {
                setMessage("Please select a start date.");
            }else if (!end_date) {
                setMessage("Please select an end date.");
            } else {
                axios.post(getHost() + "/api/tasks/new/", {
                    employee: employee,
                    task: task,
                    start_date: start_date,
                    end_date: end_date,
                    created_by: getEmployeeID(),
                })
                .then(res => {
                    setMessage(res.data.message, res.status)
                    setSuccess(true);
                }).catch(err => {
                    setMessage(err.response.data.message, err.response.status)
                    setSuccess(false);
                })
            }
        }
    }
    
    return (
        display ?
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Create New Task"
                                    onClick={()=> history.goBack()}
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
                                        id="employee" 
                                        label="employee" 
                                        value={employee}
                                        options={employees}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="task" 
                                        label="task" 
                                        type="text" 
                                        value={task} 
                                        placeholder="Task" 
                                        onChange={handleInputChange} 
                                        onClick={handleClearInput}
                                    />
                                    <Input 
                                        id="start_date" 
                                        label="start date" 
                                        type="date" 
                                        value={start_date} 
                                        onChange={handleInputChange} 
                                        onClick={handleClearInput}
                                    />
                                    <Input 
                                        id="end_date" 
                                        label="end date" 
                                        type="date" 
                                        value={end_date} 
                                        onChange={handleInputChange} 
                                        onClick={handleClearInput}
                                    />
                                    <div className="btnContainer">
                                        <CancelButton display={!isSuccess} text="Cancel"/>
                                        <SubmitButton text={isSuccess ? "Ok" : "Create"}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div> : null
    )
}

export default CreateTask;