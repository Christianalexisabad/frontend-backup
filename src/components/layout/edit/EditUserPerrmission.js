import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, isPath, Name, pathContains } from "../../../utility/Functions";
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
import { EDIT_USER_PERMISSION } from "../../../utility/Route";

const EditUserPermission = () => {

    const { id } = useParams();
    const display = pathContains(EDIT_USER_PERMISSION);
    const history = useHistory();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const fetchData = async () => {
        let response = await axios.get(getHost() + "/api/user-permissions/get/"+ id +"/");
        let { data } = response.data;
        data['user'] = data.user.id;
        data['permission'] = data.permission.id;
        setData(data);
    }

    const fetchUsers = async () => {
        let response = await axios.get(getHost() + "/api/users/");
        let { data } = response.data;
        setUsers(data);
    }

    const fetchPermissions = async () => {
        let response = await axios.get(getHost() + "/api/permissions/");
        let { data } = response.data;
        setPermissions(data);
    }

    useEffect(() => {
        if (display) {
            fetchData();
            fetchUsers();
            fetchPermissions();
        } else {
            setMessage("");
            setSuccess(false);
        }
    }, [display]);

    const {
        user,
        permission,
    } = data;

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

        if (isSuccess) {
            setMessage("");
            setSuccess(false);
        } else {
            if (!user) {
                setDialogMessage("Please select a user.");
            }else if (!permission) {
                setDialogMessage("Please enter a permission.");
            } else {
                axios.patch(getHost() + "/api/user-permissions/update/" + id + "/", {
                    user: user,
                    permission: permission
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
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Edit User Permission"
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
                                    <Select
                                        label="user"
                                        id="user"
                                        value={user}
                                        options={users}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="Permission"
                                        id="permission"
                                        value={permission}
                                        options={permissions}
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

export default EditUserPermission;