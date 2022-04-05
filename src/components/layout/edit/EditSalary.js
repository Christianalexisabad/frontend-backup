import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { hasIllegalCharacters, isInteger } from "../../../utility/Regex";
import { pathContains } from "../../../utility/Functions";
import { useHistory, useParams } from "react-router-dom";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { EDIT_SALARY } from "../../../utility/Route";

const EditSalary = () => {

    const display = pathContains(EDIT_SALARY);
    const { id } = useParams();
    const history = useHistory();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/salaries/get/"+ id + "/");
        const { data } = await response.data;
        setData(data);
    }

    const { pay_grade, amount } = data;

    useEffect(() => {
        if (display) {
            fetchData();
            setSuccess(false);
        } else {
            setMessage("");
            setSuccess(false);
        }
    }, [display]);

    function setDialogMessage (message, status) {
        setMessage(message);     
        setSuccess(status);
        return status;
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            fetchData();
            setMessage("")
            setSuccess(false);
        } else {
            if (!pay_grade) {
                setDialogMessage("Please enter a pay_grade.");
            }else if (!amount) {
                setDialogMessage("Please enter an amount.");
            }else if (!isInteger(amount)) {
                setDialogMessage("Ammount must be a number.");
            } else {
                axios.patch(getHost() + "/api/salaries/update/" + id + "/", {
                    pay_grade: pay_grade,
                    amount: amount
                }).then(res => {  
                    setDialogMessage(res.data.message, true);
                }).catch(err => {
                    setDialogMessage(err.response.data.message);
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
                                    text="Edit Salary"
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
                                        id="pay_grade"
                                        label="pay grade" 
                                        type="text" 
                                        value={pay_grade}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="amount"
                                        label="amount" 
                                        type="number" 
                                        value={amount}
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

export default EditSalary;