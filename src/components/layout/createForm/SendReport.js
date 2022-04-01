import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import {getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { UPLOAD_REPORT } from "../../../utility/Route";
import { getEmployeeID, getRole } from "../../../utility/Session";
import Select from "../../forms/select/Select";
import Attachement from "../../forms/attachment/Attachement";

const UploadReport = (props) => {

    const history = useHistory();

    const initialValues = {
        report_type: null,
        employee: getEmployeeID(),
        attachement: null,
        url: "",
    }


    const display = isPath(UPLOAD_REPORT);
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [reportTypes, setReportTypes] = useState([]);

    const fetchReportTypes = async() => {
        const response = await axios.get(getHost() + "/api/report-types/")
        const { data } = await response.data;
        setReportTypes(data);
    }

    useEffect(()=>{
        fetchReportTypes();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

    const { report_type, employee, attachement, url } = data;


    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value, files } = e.target;

        id === "attachement" ?
        setData({ ...data, [id]: files[0], url: URL.createObjectURL(files[0]) }) :
        setData({ ...data, [id]: value }) 
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("report_type", report_type);
        formData.append("employee", employee);
        formData.append("attachement", attachement, attachement.name)

        axios.post(getHost() + "/api/reports/new/", formData, {
            headers: { 'Content-Type': 'multipart/form-data'}
        }).then(res => {
            alert(res.data.message);
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
                                    text="Generate Report"
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
                                        id="report_type"
                                        label="Title"
                                        type="text" 
                                        value={report_type}
                                        options={reportTypes}
                                        placeholder="Report Type"
                                        onChange={handleInputChange} 
                                    />
                                    <Attachement
                                        url={url}
                                        value={attachement && attachement.name}
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

export default UploadReport;