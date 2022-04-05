import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isDecimal } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name, pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { EDIT_CHILD } from "../../../utility/Route";
import { getCurrentDate } from "../../../utility/DateTime";

const EditChild = () => {

    const display = pathContains(EDIT_CHILD);
    const history = useHistory();
    const { id } = useParams();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/childrens/get/"+ id + "/");
        const { data } = await response.data;
        setData(data);
    }

    const { full_name, birthdate }= data;

    useEffect(() => {
        display && fetchData();
    }, [display])

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        if (id === "birthdate" && getCurrentDate() < value ){
            setDialogMessage("Invalid birthdate");
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

            if (!full_name) {
                setDialogMessage("Please enter a full_name.");
            }else if (hasIllegalCharacters(full_name)) {
                setDialogMessage("Name contains invalid characters.");
            }else if (!birthdate) {
                setDialogMessage("Please select a birthdate.");
            }else if (getCurrentDate() < birthdate ){
                setDialogMessage("Invalid birthdate");
            } else {
                axios.patch(getHost() + "/api/childrens/update/" + id + "/", {
                    full_name: full_name,
                    birthdate: birthdate,
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
                                    text="Edit Child"
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
                                        id="full_name"
                                        label="Full Name" 
                                        type="text" 
                                        value={full_name}
                                        placeholder="Full Name" 
                                        onChange={handleInputChange} 
                                    />
                                     <Input 
                                        id="birthdate"
                                        label="birthdate" 
                                        type="date" 
                                        value={birthdate}
                                        placeholder="Birthdate" 
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

export default EditChild;