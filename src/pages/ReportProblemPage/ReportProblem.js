import CancelButton from "../../components/forms/cancelButton/CancelButton";
import SubmitButton from "../../components/forms/submitButton/SubmitButton";
import DialogBox from "../../components/forms/dialogBox/DialogBox";
import { getHost } from "../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../components/forms/input/Input";
import Title from "../../components/forms/title/Title";
import axios from "axios";
import "./ReportProblem.css";

const ReportProblem = () => {

    const history = useHistory();

    const initialData = {
        from: "candonimunicipality@gmail.com",
        to: "christianalexes@gmail.com",
        subject: "",
        content: "",
    }
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const { from, to, subject }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    useEffect(() => {
        setMessage(
            subject && data.message && ""
        );
    }, [subject, data.message])

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();
        
        if (isSuccess) {
            setData(initialData);
            setSuccess(false);
            setMessage("");
            return false;
        }

        if (!data.message || !data.subject) {
            setMessage("Please complete the details below.");
            return false;
        } else {
            if (!message) {
                setMessage("Please wait...");
            }
        }

        axios.post(getHost() + "/api/send-mail/", {
            "subject": subject,
            "message": data.message,
            "from": from,
            "to": [ to ]
        }).then(res => {  
            setDialogMessage(res.data.message, res.status);
        }).catch(err => {
            setDialogMessage(err.response.data.message);
        })
        
    }

    return (
        <div className="ReportProblem">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Report Problem"
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
                                        id="from"
                                        label="From" 
                                        type="text" 
                                        value={from}
                                        placeholder="From" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="to"
                                        label="To" 
                                        type="text" 
                                        value={to}
                                        placeholder="To" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="subject"
                                        label="Subject" 
                                        type="text" 
                                        value={subject}
                                        placeholder="Subject" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="message"
                                        label="Message" 
                                        type="text" 
                                        value={data.message}
                                        placeholder="Message" 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Back" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> history.goBack()}
                                        />
                                        <SubmitButton text={isSuccess ? "New" : "Send"} /> 
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

export default ReportProblem;