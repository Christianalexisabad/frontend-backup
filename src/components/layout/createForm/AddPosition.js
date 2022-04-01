import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters } from "../../../utility/Regex";
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
import Button from "../../forms/button/Button";
import { ADD_DEPARTMENT, ADD_POSITION, ADD_SALARY } from "../../../utility/Route";

const CreatePosition = () => {

    const display = isPath(ADD_POSITION);
    const history = useHistory();

    const initialValues = {
        position: "",
        department: "",
        salary: "",
        amount: "",
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [Departments, setDepartments] = useState({});
    const fetchDepartments = async () => {
        let response = await axios.get(getHost() + "/api/departments/");
        let { data } = await response.data;
        setDepartments(data);
    }

    const [Salaries, setSalaries] = useState({});
    const fetchSalaries = async () => {
        let response = await axios.get(getHost() + "/api/salaries/");
        let { data } = await response.data;
        setSalaries(data);
    }

    useEffect(() => {
        if (display) {
            fetchDepartments();
            fetchSalaries();
        }
    }, [display]);

    const {
        position,
        department,
        salary,
        amount
    }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value});        
    }

    useEffect(() => {
        setData({ ...data, amount: salary ? getData(parseInt(salary), 'amount', Salaries)  : 0})
    }, [salary]);

    const handleClearInput = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: ""});        
    }
    function clearData () {
        setMessage("");
        setData(initialValues);
        setSuccess(false);
    }   

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
            if(!position){
                setMessage("Title is required.");
                return false;
            }else if(hasIllegalCharacters(position)){
                setMessage("Title contains invalid characters.");
                return false;
            }else if(!department){
                setMessage("Please select an department.");
                return false;
            }else if(!salary){
                setMessage("Please select a salary.");
                return false;
            } else {
                axios.post(getHost() + "/api/positions/new/", {
                    title: position,
                    department: parseInt(department),
                    salary: parseInt(salary)
                })
                .then(res => {
                    setMessage(res.data.message, res.status);   
                    setSuccess(true);                
                }).catch(err => {
                    setMessage(err.response.data.message);                    
                    setSuccess(false);                
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
                                    text="Add New Postion"
                                    onClick={() => {
                                        setData(initialValues)
                                        history.goBack()
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
                                        id="position"
                                        label="Title" 
                                        type="text" 
                                        placeholder="Title"
                                        value={position}
                                        onChange={handleInputChange} 
                                        onClick={handleClearInput}
                                    />
                                    <Select 
                                        id="department" 
                                        label="department" 
                                        value={department} 
                                        options={Departments} 
                                        createText="Add Department" 
                                        refresh={()=> fetchDepartments()}
                                        create={ADD_DEPARTMENT}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="salary" 
                                        label="salary" 
                                        value={salary} 
                                        options={Salaries} 
                                        createText="Create Salary" 
                                        create={ADD_SALARY}
                                        refresh={()=> fetchSalaries()}
                                        onChange={handleInputChange} 
                                    /> 
                                    <Input
                                        label="amount" 
                                        type="text"
                                        value={amount > 0 ? "P " + amount : "---"}
                                        disabled={true}
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
                                        <SubmitButton text={isSuccess ? "New" : "Save"} /> 
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

export default CreatePosition;