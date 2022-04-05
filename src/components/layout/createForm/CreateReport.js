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
import { GENERATE_REPORT } from "../../../utility/Route";
import Select from "../../forms/select/Select";
import GenerateReport from "../../../pages/generateReport/GenerateReport";

const CreateReport = (props) => {

    const history = useHistory();

    const initialData = {
        report_type: null,
        start_date: "",
        end_date: "",
    }

    const display = isPath(GENERATE_REPORT);
    
    const [state, setState] = useState({});
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [createReport, setCreateReport] = useState(false);
    const [title, setTitle] = useState("");

    const [reportTypes, setReportTypes] = useState([]);

    let { report_type, start_date, end_date }= state;

    const fetchData = async(path) => {
        const response = await axios.get(getHost() + path)
        const { data } = await response.data;
        setData(data);
    }
    
    const fetchReportTypes = async() => {
        const response = await axios.get(getHost() + "/api/report-types/")
        const { data } = await response.data;
        setReportTypes(data);
    }

    useEffect(()=>{
        display && fetchReportTypes();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

    const handleInputChange = (e) => {
        e.preventDefault();

        setState({ ...state, [e.target.id]: e.target.value });        
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  
        data.length > 0 && setCreateReport(true);
    }

    useEffect(() => { 
        if (start_date && end_date ) {

            report_type = parseInt(report_type);
            alert(report_type)

            if (report_type === 1 ){
                setTitle("List of Employees")
                fetchData("/api/employees/" + start_date+"/"+end_date+"/")
            } else if (report_type === 2 ){
                setTitle("List of Employees")
                fetchData("/api/employees/" + start_date+"/"+end_date+"/")
            }else if (report_type === 3 ){
                setTitle("List of Male Employees")
                fetchData("/api/employees/generate-report/sex/male/" + start_date+"/"+end_date+"/")
            }else if (report_type === 4 ){
                setTitle("List of Female Employees")
                fetchData("/api/employees/generate-report/sex/female/" + start_date+"/"+end_date+"/")
            }
        }
    }, [start_date, end_date, report_type])

    if (createReport) {
        return <GenerateReport title={title} from={start_date} to={end_date}data={data} onClose={()=> setCreateReport(false)}/>
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
                                        setData(initialData);
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
                                        label="Report Type"
                                        type="text" 
                                        value={report_type}
                                        refresh={()=> fetchReportTypes()}
                                        options={reportTypes}
                                        placeholder="Report Type"
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="start_date"
                                        label="From"
                                        type="date" 
                                        value={start_date}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="end_date"
                                        label="To"
                                        type="date" 
                                        value={end_date}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="total"
                                        label="Total"
                                        type="total" 
                                        value={data.length}
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
                                        <SubmitButton text="Create" disabled={data.length === 0 ? true : false} /> 
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

export default CreateReport;