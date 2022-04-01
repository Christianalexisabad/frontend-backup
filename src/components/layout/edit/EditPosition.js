import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getData, getDateTime, isPath, Name, pathContains } from "../../../utility/Functions";
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
import { ADD_DEPARTMENT, ADD_SALARY, EDIT_POSITION } from "../../../utility/Route";

const EditPosition = () => {

    const { id } = useParams();
    const display = pathContains(EDIT_POSITION);
    const history = useHistory();

    const [data, setData] = useState({});
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [Departments, setDepartments] = useState({});
    const fetchDepartments = async () => {
        let response = await axios.get(getHost() + "/api/departments/");
        let { data } = response.data;
        setDepartments(data);
    }

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/positions/get/"+ id + "/");
        let { data } = await response.data;
        data['position'] = data['title'];
        data['department'] = data['department']['id'];
        data['salary'] = data['salary']['id'];
        setData(data);
    }

    const [Salaries, setSalaries] = useState({});
    const fetchSalaries = async () => {
        let response = await axios.get(getHost() + "/api/salaries/");
        let { data } = response.data;
        setSalaries(data);
    }

    useEffect(() => {
        if (display) {
            fetchData();
            fetchDepartments();
            fetchSalaries();
        }   
    }, [display]);

    const {
        position,
        department,
        salary,
    }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    useEffect(() => {
        setAmount(salary ? getData(parseInt(salary), 'amount', Salaries)  : 0)
    }, [salary]);

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            fetchData();
            setMessage("");
            setSuccess(false);
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
                axios.patch(getHost() + "/api/positions/update/" + id + "/", {
                    title: position,
                    department: department,
                    salary: salary
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
                                    text="Edit Postion"
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
                                        id="position"
                                        label="Position" 
                                        type="text" 
                                        value={position}
                                        onChange={handleInputChange} 
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
                                        value={"P " + amount}
                                        disabled={true}
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

export default EditPosition;