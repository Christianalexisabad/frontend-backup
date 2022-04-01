import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name } from "../../../utility/Functions";
import BackButton from "../../forms/backButton/BackButton";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";

const AddDepartmentHead = () => {

    const display = isPath("/pages/department/department%20heads/new/");
    const history = useHistory();

    const initialValues = {
        department: 0,
        employee: 0,
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [Departments, setDepartments] = useState([]);
    const [Employees, setEmployees] = useState([]);
  
    const fetchDepartments = async () => {
        let response = await axios.get(getHost() + "/api/departments/");
        let { data } = response.data;
        setDepartments(data);
    }

    const fetchEmployees = async () => {
        let response = await axios.get(getHost() + "/api/employees/");
        let { data } = response.data;
        setEmployees(data);
    }

    function getEmployees (id) {
        let data = [];
        for (const item of Employees) {
            if (item.department === id) {
                data.push(item);
            }  
        }
        console.log(data);
        setEmployees(data)
    }

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const {
        department,
        employee
    } = data;

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        if(id === 'department') {
            setData({ ...data, [e.target.id]: e.target.value });    
        } else {
            setData({ ...data, [e.target.id]: e.target.value });        
        }
    }

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

            if (!department) {
                setDialogMessage("Please select a department.");
            } else {
                axios.post(getHost() + "/api/department-heads/new/", {
                    department: department,
                }).then(res => {      
                    setDialogMessage(res.data.message, true);
                }).catch(err => {
                    setDialogMessage(err.response.data.message);
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
                                    text="Create Department Head"
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
                                    <Select
                                        label="department"
                                        id="department"
                                        value={department}
                                        options={Departments}
                                        refresh={()=> fetchDepartments()}
                                        createText="Add Department" 
                                        create="/pages/department/departments/add/"
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="employee"
                                        id="employee"
                                        value={employee}
                                        options={Employees}
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

export default AddDepartmentHead;