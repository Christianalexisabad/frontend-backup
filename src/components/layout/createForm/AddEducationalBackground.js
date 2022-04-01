import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isDecimal } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_EDUCATIONAL_BACKGROUND } from "../../../utility/Route";
import { getEmployeeID } from "../../../utility/Session";
import { getCurrentDate } from "../../../utility/DateTime";

const AddEducationalBackground = () => {

    const display = isPath(ADD_EDUCATIONAL_BACKGROUND);
    const history = useHistory();
    const employee = getEmployeeID();

    const initialValues = {
        level: "",
        school_name: "",
        course: "",
        year_from: "",
        year_to: "",
        units_earned: "",
        date_graduated: ""
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    
    const { level, school_name, course, year_from, year_to, units_earned, date_graduated }= data;

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        if (id === "date_graduated" && getCurrentDate() < value ){
            setDialogMessage("Date is invalid.");
        }

        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

            if (!school_name) {
                setDialogMessage("Please enter a school name.");
            }else if (!level) {
                setDialogMessage("Please level.");
            } else {
                axios.post(getHost() + "/api/childrens/new/", {
                    level: level,
                    school_name: school_name,
                    course: course,
                    year_from: year_from,
                    year_to: year_to,
                    units_earned: units_earned,
                    date_graduated: date_graduated,
                    employee: employee,
                    created_at: getCurrentDate(),
                }).then(res => {  
                    setDialogMessage(res.data.message, res.status);
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
                                    text="Add Educational Background"
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
                                    <Input 
                                        id="school_name"
                                        label="School Name" 
                                        type="text" 
                                        value={school_name}
                                        placeholder="School Name" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="level"
                                        label="Level" 
                                        type="text" 
                                        value={level}
                                        placeholder="Level" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="course"
                                        label="Basic Ed./Degre/Course" 
                                        type="text" 
                                        value={course}
                                        placeholder="Basic Ed./Degre/Course"  
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="units_earned"
                                        label="Highest Level/Units Earned" 
                                        type="text" 
                                        value={units_earned}
                                        placeholder="Highest Level/Units Earned" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="from year"
                                        label="From year" 
                                        type="text" 
                                        value={year_from}
                                        placeholder="From year" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="units_earned"
                                        label="To year" 
                                        type="text" 
                                        value={year_to}
                                        placeholder="To year" 
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

export default AddEducationalBackground;