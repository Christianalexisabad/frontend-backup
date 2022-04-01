import { isName, isUsername } from "../../../utility/Regex";
import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getData, isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_GROUP, ADD_ROLE, ADD_USER } from "../../../utility/Route";

const AddUser = () => {

    const display = isPath(ADD_USER);

    const history = useHistory();

    const initialValues = {
        employee: null,
        role: null,
        user_type: null,
        group: null,
        sur_name: "",
        first_name: "",
        username: ""
    };

    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [Employees, setEmployees] = useState([]);
    const [UserTypes, setUserTypes] = useState([]);
    const [Roles, setRoles] = useState([]);
    const [Groups, setGroups] = useState([]);

    const fetchEmployees = async () => {
        let response = await axios.get(getHost() + "/api/employees/");
        setEmployees(await response.data.data);
    }

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

    function getRoles(user_type){
        let data = [];
        for (const item of Roles) {
            item.user_type.id === parseInt(user_type) && data.push(item);
        }
        setRoles(data);
    }

    function getRoles (user_type, object) {

        const roles = [];

        for (const item of Roles) {
            if (item.user_type.id === user_type) {
                roles.push(item);
            }  
        }
        return roles;
    }

    const {
        role,
        user_type,
        group,
        employee,
        sur_name,
        first_name,
        username,
    } = data;

    useEffect(() => {
        if (display) {
            fetchEmployees();
            fetchUserTypes();
            fetchRoles();
            fetchGroups();
        }
    }, [display]);



    const handleInputChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;

        if (id === 'user_type') {
            getRoles(value);
        }

        setData({ ...data, [id]: value });        
    }

    useEffect(() => {
    }, [employee]);

    useEffect(() => {
        if (employee) {
            const id = parseInt(employee)
            setData({ ...data, 
                first_name: getData(id, "first_name", Employees),
                sur_name: getData(id, "sur_name", Employees),
                username: getData(id, "employee_no", Employees),
                password: getData(id, "employee_no", Employees)
            });
        } else {
            setData({ ...data, 
                first_name: "",
                sur_name: "",
                username: "",
                password: "",
            });
        }
    }, [employee]);

    function clearData () {
        setData(initialValues);
        setSuccess(false);
        setMessage("");
    }   

    function setDialogMessage(message, success) {
        success = success ? success : false;
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
            }else if (!group) {
                setDialogMessage("Please select a user group");
            }else if (!first_name) {
                setDialogMessage("First name must be provided.");
            }else if (!isName(first_name)) {
                setDialogMessage("First name contains illegal characters.");
            }else if (!sur_name) {
                setDialogMessage("Surname must be provided.");
            }else if (!isName(sur_name)) {
                setDialogMessage("Surname contains illegal characters.");
            }else if (!username) {
                setDialogMessage("Username must be provided.");
            } else {
                postData();
            }
        }
    }

    function postData() {
        axios.post(getHost() + "/api/users/new/", {
            user_type: user_type,
            role: role,
            sur_name: sur_name,
            first_name: first_name,
            username: username,
            password: username,
            employee: employee, 
        })
        .then(res => {

            const { id } = res.data.data;

            axios.post(getHost() + "/api/user-groups/new/",{
                user: id,
                group: group
            }).then(res => {
                setDialogMessage("User Created Successfully!", res.status);
                setSuccess(true);
            })
        }).catch(err => {
            setMessage(err.response.data.message);
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
                                    text="Add New User"
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
                                        label="employee no" 
                                        id="employee" 
                                        value={employee} 
                                        options={Employees} 
                                        onChange={handleInputChange}
                                    />
                                     <Input 
                                        label="first name"
                                        type="text" 
                                        id="first_name" 
                                        disabled={true}
                                        value={first_name} 
                                        placeholder="First Name" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        label="surname" 
                                        type="text" 
                                        id="sur_name" 
                                        disabled={true}
                                        value={sur_name} 
                                        placeholder="Surname"  
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        label="user type" 
                                        id="user_type" 
                                        value={user_type} 
                                        options={UserTypes} 
                                        onChange={handleInputChange}
                                    />
                                    <Select 
                                        label="role" 
                                        id="role" 
                                        value={role} 
                                        options={getRoles(parseInt(user_type))} 
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
                                        create={ADD_GROUP}
                                        refresh={()=> fetchGroups()}
                                        onChange={handleInputChange}
                                    />
                                    <Input 
                                        label="username"
                                        type="text" 
                                        id="username" 
                                        value={username} 
                                        placeholder="Username" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="password"
                                        label="password"
                                        type="text" 
                                        disabled={true} 
                                        value={username} 
                                        placeholder="Password" 
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
                                        <SubmitButton text={isSuccess ? "New" : "Save"} /> 
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

export default AddUser;