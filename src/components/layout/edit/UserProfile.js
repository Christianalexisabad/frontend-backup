import { isName } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getActiveStatus, pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import { ADD_GROUP, ADD_ROLE } from "../../../utility/Route";
import Button from "../../forms/button/Button";
import ConfirmDialog from "../../forms/confirmDialog/ConfirmDialog";
import axios from "axios";
import "./Style.css";

const UserProfile = () => {

    const isUserProfile = pathContains("/pages/users/profile/")
    const isEmployeeProfile = pathContains("/pages/employee/employees/profile/");
    const display = isUserProfile || isEmployeeProfile;
    const history = useHistory();
    const { username, employee } = useParams();
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [UserTypes, setUserTypes] = useState([]);
    const [Roles, setRoles] = useState([]);
    const [Groups, setGroups] = useState([]);
    const [toReset, setToReset] = useState(null);

    const fetchData = useCallback(async () => {
        let response = ""
        const endpoint = isUserProfile ? getHost() + "/api/users/get/" + username + "/" : getHost() + "/api/users/get/employee=" + employee + "/"
        response = await axios.get(endpoint);
        let { data } = await response.data;
        data['userName'] = data.username;
        data['user_type'] = data.role.user_type.id;
        data['role'] = data.role.id;
        setData(data);
    }, [ employee, username, isUserProfile ])

    const fetchUserTypes = async () => {
        let response = await axios.get(getHost() + "/api/user-types/");
        setUserTypes(await response.data);
    }

    const fetchRoles = async () => {
        let response = await axios.get(getHost() + "/api/roles/");
        setRoles(await response.data);
    }

    const fetchGroups = async () => {
        let response = await axios.get(getHost() + "/api/groups/");
        setGroups(await response.data);
    }

    const {
        id,
        role,
        user_type,
        sur_name,
        group,
        userName,
        is_active,
        is_deactivated,
        first_name,
    } = data;

    useEffect(() => {
        if (display) {
            // setEdit(false);
            // fetchUserTypes();
            // fetchRoles();
            // fetchGroups();
            // fetchData();
        }
    }, [ display, fetchData ]);

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function clearData () {
        setSuccess(false);
        setMessage("");
    }   

    function setDialogMessage(message, success) {
        setMessage(message);
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {

            if (!user_type) {
                setDialogMessage("Please select a user type");
            }else if (!role) {
                setDialogMessage("Please select a role");
            }else if (!first_name) {
                setDialogMessage("First name must be provided.");
            }else if (!isName(first_name)) {
                setDialogMessage("First name contains illegal characters.");
            }else if (!sur_name) {
                setDialogMessage("Surname must be provided.");
            }else if (!isName(sur_name)) {
                setDialogMessage("Surname contains illegal characters.");
            } else {
                patchData();
            }
        }
    }

    function patchData() {
        axios.patch(getHost() + "/api/users/update/" + id +"/", {
            user_type: user_type,
            role: role,
            sur_name: sur_name,
            first_name: first_name,
        }).then(res => {
            updateUserGroup();
            setMessage("User Updated Successfully!");
            setSuccess(true);
        }).catch(err => {
            setMessage(err.response.data.message);
        })
    }

    function updateUserGroup() {
        axios.patch(getHost() + "/api/user-groups/update/user=" + id + "/", {
            group: group,
        })
    }

    const styles = {
        form: {
            width: isUserProfile ? "auto" : "70%",
        }
    }   

    return (
        display &&
        <div className="EditForm">
            <ConfirmDialog data={toReset} onCancel={() => setToReset(null)} />
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                {
                                    isUserProfile ? 
                                    <Title 
                                        text="User Profile"
                                        onClick={() => {
                                            setMessage("");
                                            history.goBack();
                                        }}
                                    /> : <Title text="User Account" />
                                }
                                <p>Status: {is_deactivated ? <span className="text-danger">Deactivated</span> : getActiveStatus(is_active)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="content">
                                <form onSubmit={handleSubmit} style={styles.form}>
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                    <Select 
                                        label="user type" 
                                        id="user_type" 
                                        value={user_type} 
                                        options={UserTypes} 
                                        disabled={!isEdit}
                                        refresh={()=> fetchUserTypes()}
                                        onChange={handleInputChange}
                                    />
                                    <Select 
                                        label="role" 
                                        id="role" 
                                        value={role} 
                                        disabled={!isEdit}
                                        options={Roles} 
                                        createText="Add Role" 
                                        create={ADD_ROLE}
                                        refresh={()=> fetchRoles()}
                                        onChange={handleInputChange}
                                    />
                                    <Select 
                                        label="group name" 
                                        id="group" 
                                        value={group}  
                                        options={Groups} 
                                        createText="Add Group" 
                                        disabled={!isEdit}
                                        create={ADD_GROUP}
                                        refresh={()=> fetchGroups()}
                                        onChange={handleInputChange}
                                    />
                                    <Input 
                                        label="first name"
                                        type="text" 
                                        id="first_name" 
                                        disabled={!isEdit} 
                                        value={first_name} 
                                        placeholder="First Name" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        label="surname" 
                                        type="text" 
                                        id="sur_name" 
                                        value={sur_name} 
                                        disabled={!isEdit} 
                                        placeholder="Surname"  
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        label="username"
                                        type="text" 
                                        id="username" 
                                        value={!username ? userName : username} 
                                        disabled={!isEdit} 
                                        placeholder="Username" 
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        {isEdit && <span>
                                            {!is_deactivated ? <CancelButton text="Deactivate"
                                                onClick={()=> {
                                                    const user = username? username : userName
                                                    setToReset({
                                                        method: "update",
                                                        url: getHost() + "/api/users/deactivate/username="+user+"/",
                                                        message: "Are you sure you want to deactivate \""+ user +"\"?",
                                                        data: {}
                                                    })
                                                }} 
                                            /> : 
                                                <SubmitButton text="Enable" type="button"
                                                    onClick={()=> {
                                                        const user = username? username : userName
                                                        setToReset({
                                                            method: "update",
                                                            url: getHost() + "/api/users/activate/username="+user+"/",
                                                            message: "Are you sure you want to enable \""+ user +"\"?",
                                                            data: {}
                                                        })
                                                    }} 
                                                />
                                            }
                                        </span> }
                                        {!isSuccess && <Button display={isEdit} text="Logout" 
                                            onClick={()=> {
                                                const user = username? username : userName
                                                setToReset({
                                                    method: "logout",
                                                    url: getHost() + "/api/sessions/logout/username="+user+"/",
                                                    message: "Are you sure you want to logout \""+ user +"\"?",
                                                    data: {
                                                        url: getHost() + "/api/users/update-active-status/"+user+"/",
                                                        data: {
                                                            is_active: false
                                                        }
                                                    }
                                                })
                                            }} 
                                        />}
                                        {!isSuccess && <Button display={isEdit} text="Reset Password" onClick={()=> {
                                            const user = username ? username : userName;
                                            setToReset({
                                                method: "update",
                                                url: getHost() + "/api/users/reset-password/",
                                                message: "Are you sure you want to reset your password of user \""+ user +"\"?",
                                                data: {
                                                    username: user
                                                }
                                            })
                                        }} />}
                                        {!isSuccess && <CancelButton 
                                            display={isEdit} 
                                            text="Cancel" 
                                            onClick={()=> setEdit(false)} 
                                        />}
                                        <SubmitButton display={isEdit} text={isSuccess ? "Ok" : "Save"} /> 
                                        <Button 
                                            display={!isEdit} 
                                            text="Edit" 
                                            onClick={()=> setEdit(true)} 
                                        />
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

export default UserProfile;