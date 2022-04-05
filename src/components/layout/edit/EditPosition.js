import { hasIllegalCharacters, isName } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getData, hasChanges, isDataChanged, pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_DEPARTMENT, ADD_SALARY, EDIT_POSITION } from "../../../utility/Route";

const EditPosition = () => {

    const { id } = useParams();
    const display = pathContains(EDIT_POSITION) && id ? true : false;
    const history = useHistory();

    const [data, setData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [Salaries, setSalaries] = useState({});
    const [Departments, setDepartments] = useState({});

    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/");
        const { data } = response.data;
        setDepartments(data);
    }

    const fetchData = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/positions/get/"+ id + "/");
        let { data } = await response.data;
        data['position'] = data['title'];
        data['department'] = data['department']['id'];
        data['salary'] = data['salary']['id'];
        setData(data);
        setInitialData(data);
    }, [ id ])
    
    const fetchSalaries = async () => {
        const response = await axios.get(getHost() + "/api/salaries/");
        let { data } = response.data;
        setSalaries(data);
    }

    useEffect(() => {
        if (display) {
            fetchData();
            fetchDepartments();
            fetchSalaries();
        }   
    }, [ display, fetchData ]);

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
        if (salary) {
            setAmount(getData(parseInt(salary), 'amount', Salaries))
        }
    }, [salary, Salaries]);

     // error message
    const [err, setErr] = useState({});

    useEffect(() => {

        let error = !position ? "Required" : "";

        if (position && !isName(position)) {
            error = "Contains invalid characters."
        }

        if (error !== err.position) {
            setErr({ ...err, position: error });
        }

    }, [ err, err.position, position ]);

    useEffect(() => {

        let error = !department ? "Required" : "";

        if (error !== err.department) {
            setErr({ ...err, department: error });
        }

    }, [ err, err.department, department ]);

    useEffect(() => {

        let error = !salary ? "Required" : "";

        if (error !== err.salary) {
            setErr({ ...err, salary: error });
        }

    }, [ err, err.salary, salary ]);

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
                                        errMessage={err.position}
                                        id="position"
                                        label="Position" 
                                        type="text" 
                                        value={position}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        errMessage={err.department}
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
                                        errMessage={err.salary}
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
                                        {!isSuccess &&
                                            <CancelButton
                                                display={isDataChanged(initialData, data)} 
                                                text="Reset" 
                                                isSuccess={isSuccess} 
                                                onClick={()=> {
                                                    setMessage("");
                                                    setData(initialData);
                                                }}
                                            />
                                        }
                                        <SubmitButton 
                                            text={isSuccess ? "Ok" : "Save"} 
                                            disabled={hasChanges(err) || !isDataChanged(initialData, data)}
                                        /> 
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