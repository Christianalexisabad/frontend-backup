import { isInteger } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_SALARY } from "../../../utility/Route";

const AddSalary = () => {

    const display = isPath(ADD_SALARY);
    const history = useHistory();

    const initialData = {
        pay_grade: "",
        amount: 0,
    }

    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const {
        pay_grade,
        amount
    }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setData(initialData);
        setSuccess(false);
    }   

    const handleSubmit = (e) => { 
        e.preventDefault();  


        if (isSuccess) {
            clearData();
        } else {
            if(!pay_grade){
                setMessage("Pay grade is required.");
            }else if(!amount){
                setMessage("Please enter an amount.");
            } else {
                axios.post(getHost() + "/api/salaries/new/", {
                    pay_grade: pay_grade,
                    amount: amount
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
        display ?
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Add New Salary"
                                    onClick={() => {
                                        setMessage("");
                                        setData(initialData)
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
                                        id="pay_grade"
                                        label="Pay Grade" 
                                        type="text" 
                                        placeholder="25/1"
                                        value={pay_grade}
                                        onChange={handleInputChange} 
                                    />
                                     <Input 
                                        id="amount"
                                        label="amount"  
                                        type="number" 
                                        placeholder="0"
                                        value={amount}
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialData);
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
        </div> : null
    )
}

export default AddSalary;