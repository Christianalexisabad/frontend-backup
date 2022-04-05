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
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import Button from "../../forms/button/Button";
import { ADD_GROUP, ADD_USER, CREATE_USER_GROUP } from "../../../utility/Route";

const CreateUserGroup = () => {

    const display = isPath(CREATE_USER_GROUP);
    const history = useHistory();

    const initialData = {
        group: "",
        user: ""
    }
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [Groups, setGroups] = useState([]);
    const [Users, setUsers] = useState([]);
  
    const fetchGroups = async () => {
        let response = await axios.get(getHost() + "/api/groups/");
        let { data } = response.data;
        setGroups(data);
    }

    const fetchUsers = async () => {
        let response = await axios.get(getHost() + "/api/users/");
        let { data } = response.data;
        setUsers(data);
    }

    useEffect(() => {
        if (display) {
            fetchGroups();
            fetchUsers();
        } else {
            clearData();
        }
    }, [display]);

    const {
        user,
        group
    } = data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setMessage("");
        setData(initialData);
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
                setDialogMessage("Please enter a user.");
            }else if (!group) {
                setDialogMessage("Please select a group.");
            } else {
                axios.post(getHost() + "/api/user-groups/new/", {
                    group: group,
                    user: user
                }).then(res => {  
                    setDialogMessage(res.data.message, true);
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
                                    text="Create User Group"
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
                                        label="user"
                                        id="user"
                                        value={user}
                                        options={Users}
                                        createText="Add User" 
                                        create={ADD_USER}
                                        refresh={()=> fetchUsers()}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="group"
                                        id="group"
                                        value={group}
                                        options={Groups}
                                        createText="Add Group" 
                                        create={ADD_GROUP}
                                        refresh={()=> fetchUsers()}
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

export default CreateUserGroup;