import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { pathContains } from "../../../utility/Functions";
import { useHistory, useParams } from "react-router-dom";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import { EDIT_USER_GROUP } from "../../../utility/Route";
import React, { useEffect, useState } from "react";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import Select from "../../forms/select/Select";

const EditUserGroup = () => {

    const display = pathContains(EDIT_USER_GROUP);
    const { id } = useParams();
    const history = useHistory();

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/user-groups/get/"+ id + "/");
        const { data } = await response.data;
        data['group'] = data.group.id;
        data['user'] = data.user.id;
        setData(data);
    }

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

    const {
        user,
        group
    } = data;

    useEffect(() => {
        if (display) {
            fetchData();
            fetchGroups();
            fetchUsers();
            setSuccess(false);
        } else {
            setMessage("");
            setSuccess(false);
        }
    }, [display]);

    function setDialogMessage (message, status) {
        setMessage(message);     
        setSuccess(status);
        return status;
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            fetchData();
            setSuccess(true);
            setMessage("");
        } else {
            if (!user) {
                setDialogMessage("Please enter a user.");
            }else if (!group) {
                setDialogMessage("Please select a group.");
            } else {
                axios.patch(getHost() + "/api/user-groups/update/" + id +"/", {
                    group: group,
                    user: user
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
                                    text="Edit User Group"
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
                                        options={Users}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        label="group"
                                        id="group"
                                        value={group}
                                        options={Groups}
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

export default EditUserGroup;