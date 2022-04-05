import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isDecimal } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name } from "../../../utility/Functions";
import BackButton from "../../forms/backButton/BackButton";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_ROLE } from "../../../utility/Route";
import Select from "../../forms/select/Select";

const AddRole = () => {

    const display = isPath(ADD_ROLE);
    const history = useHistory();

    const initialData = {
        title: "",
        user_type: null,
    }
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [UserTypes, setUserTypes] = useState({});

    const fetchUserTypes = async () => {
        const response = await axios.get(getHost() + "/api/user-types/")
        let { data } = await response.data;
        setUserTypes(data);
    }

    useEffect(() => {
        fetchUserTypes();
    }, [])

    const { title, user_type }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

            if (!title) {
                setDialogMessage("Please enter a title.");
            }else if (hasIllegalCharacters(title)) {
                setDialogMessage("Name contains invalid characters.");
            }else if (!user_type) {
                setDialogMessage("Please select a user type.");
            } else{
                axios.post(getHost() + "/api/roles/new/", {
                    title: title,
                    user_type: user_type,
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
                                    text="Add New Role"
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
                                    <Input 
                                        id="title"
                                        label="title" 
                                        type="text" 
                                        value={title}
                                        placeholder="Title" 
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="user_type"
                                        label="user type" 
                                        type="text" 
                                        value={user_type}
                                        options={UserTypes}
                                        placeholder="User type" 
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

export default AddRole;