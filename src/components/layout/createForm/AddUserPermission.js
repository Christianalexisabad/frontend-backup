import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name } from "../../../utility/Functions";
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
import Button from "../../forms/button/Button";
import { getUserType } from "../../../utility/Session";
import { ADD_USER, ADD_USER_PERMISSION } from "../../../utility/Route";

const AddUserPermission = () => {

    const display = isPath(ADD_USER_PERMISSION);
    const history = useHistory();

    const initialValues = {
        user: "",
        permission: ""
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
  
    const fetchUsers = async () => {
        let response = await axios.get(getHost() + "/api/users/");
        let { data } = await response.data;
        setUsers(data);
    }

    const fetchPermissions = async () => {
        let response = await axios.get(getHost() + "/api/permissions/");
        let { data } = await response.data;
        setPermissions(data);
    }

    useEffect(() => {
        if (display) {
            fetchUsers();
            fetchPermissions();
        } else {
            clearData();
        }
    }, [display]);

    const {
        permission,
        user
    } = data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setData(initialValues);
        setSuccess(false);
    }   

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

            if (!user) {
                setDialogMessage("Please select a user.");
            }else if (!permission) {
                setDialogMessage("Please enter a permission.");
            } else {
                axios.post(getHost() + "/api/user-permissions/new/", {
                    user: user,
                    permission: permission
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
                                    text="Add User Permission"
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
                                        label="user"
                                        id="user"
                                        value={user}
                                        options={users}
                                        createText="Add User" 
                                        create={ADD_USER}
                                        refresh={()=> fetchUsers()}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="Permission"
                                        id="permission"
                                        value={permission}
                                        options={permissions}
                                        refresh={()=> fetchPermissions()}
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

export default AddUserPermission;