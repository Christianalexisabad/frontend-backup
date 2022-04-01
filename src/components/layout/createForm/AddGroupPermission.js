import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { ADD_GROUP, ADD_GROUP_PERMISSION } from "../../../utility/Route";
import { useHistory } from "react-router-dom";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";

const AddGroupPermission = () => {

    const display = isPath(ADD_GROUP_PERMISSION);
    const history = useHistory();

    const initialValues = {
        group: "",
        permission: ""
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([]);
  
    const fetchGroups = async () => {
        let response = await axios.get(getHost() + "/api/groups/");
        let { data } = response.data;
        setGroups(data);
    }

    const fetchPermissions = async () => {
        let response = await axios.get(getHost() + "/api/permissions/");
        let { data } = response.data;
        setPermissions(data);
    }

    useEffect(() => {
        fetchGroups();
        fetchPermissions();
    }, []);

    const {
        permission,
        group
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

            if (!group) {
                setDialogMessage("Please select a group.");
            }else if (!permission) {
                setDialogMessage("Please enter a permission.");
            } else {
                axios.post(getHost() + "/api/group-permissions/new/", {
                    group: group,
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
                                    text="Add New Group Permission"
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
                                        label="group"
                                        id="group"
                                        value={group}
                                        options={groups}
                                        createText="Add Group" 
                                        create={ADD_GROUP}
                                        refresh={()=> fetchGroups()}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="Permission"
                                        id="permission"
                                        refresh={()=> fetchPermissions()}
                                        value={permission}
                                        options={permissions}
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

export default AddGroupPermission;