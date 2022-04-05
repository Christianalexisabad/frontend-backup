import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getUsername } from "../../../../../utility/Session";
import SubmitButton from "../../../../forms/submitButton/SubmitButton";
import CancelButton from "../../../../forms/cancelButton/CancelButton";
import DialogBox from "../../../../forms/dialogBox/DialogBox";
import ImageUploader from "../../../../forms/imageUploader/ImageUploader";
import Input from "../../../../forms/input/Input";
import Title from "../../../../forms/title/Title";
import EditButton from "../../../../forms/editButton/EditButton";
import { isName } from "../../../../../utility/Regex";
import axios from "axios";
import { getHost } from "../../../../../utility/APIService";
import { encrypt } from "../../../../../utility/Encryption";
import Button from "../../../../forms/button/Button";
import "./Account.css";
import { isPath } from "../../../../../utility/Functions";
import { ACCOUNT } from "../../../../../utility/Route";

export default function Account() {

    const display = isPath(ACCOUNT);
    const history = useHistory();
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const HOST = getHost();

    const fetchData = useCallback(async() => {
        const response = await axios.get(HOST + "/api/users/get/username=" + getUsername() + "/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST ])

    useEffect(() => {
        // if (display) {
        //     fetchData();
        // } else {
        //     setEdit(false);
        //     setMessage("");
        // }
    }, [ display, fetchData ]);

    const { id, imageURL, image, sur_name, first_name, username, email } = data;

    const handleInputChange = (e) => {
        e.preventDefault();

        let { id, type , files, value } = e.target;

        if (type === 'file') {
            setData({ ...data, [id]: files[0], imageURL: URL.createObjectURL(files[0])});
        } else {
            setData({ ...data, [id]: value });        
        }
    }

    function setDialogMessage(message, success) {
        setMessage(message);
        setSuccess(success ? success : false);  
    }

    function patchData() {

        let formData = new FormData();

        formData.append("id", id);
        formData.append("username", username);
        formData.append("sur_name", sur_name);
        formData.append("first_name", first_name);

        if (typeof image !== "string") {
            formData.append("image", image, image.name);
        }   
        formData.append("email", email);

        axios.patch(HOST + "/api/users/update/" + id + "/", formData, {
            headers : { 'Content-Type': 'multipart/form-data'}
        })
        .then(res => {
            localStorage.setItem('username', encrypt(username));
            setDialogMessage("Account Updated Successfully!", true);
            setEdit(false);
            
        }).catch(err => {
            setMessage(err.response.data.message);
            setSuccess(false);
        })
    }

    const handleSubmit = (e) => { 
        e.preventDefault();

        if (isEdit) {
            if (!username) {
                setDialogMessage("Username must be provided.");
            } else if (!first_name) {
                setDialogMessage("First name must be provided.");
            }else if (!isName(first_name)) {
                setDialogMessage("Surname must be provided.");
            } else {
                patchData();
            }
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEdit(false);
    }

    return (
        display &&
        <div className="Account">
            <center>
                <div className="container bg-white">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                  text="My Account"
                                  onClick={()=> history.goBack()}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <form onSubmit={handleSubmit}>
                                <DialogBox 
                                    message={message} 
                                    isSuccess={isSuccess}
                                    onClose={() => setMessage("")}
                                />
                                <ImageUploader 
                                    src={typeof image === "string" ? HOST + image : imageURL} 
                                    disabled={!isEdit} 
                                    onChange={handleInputChange} 
                                />
                                <Input 
                                    id="username"  
                                    label="Username" 
                                    disabled={!isEdit}  
                                    value={username} 
                                    onChange={handleInputChange} 
                                />
                                {!isEdit && <Input 
                                    label="Name" 
                                    value={first_name + " " + sur_name} 
                                    disabled={true} 
                                />}
                                {isEdit && <span>
                                    <Input 
                                        id="first_name"  
                                        label="First Name" 
                                        disabled={!isEdit} 
                                        value={first_name} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="sur_name"  
                                        label="Surname" 
                                        disabled={!isEdit} 
                                        value={sur_name} 
                                        onChange={handleInputChange} 
                                    />
                                </span>}
                                <Input 
                                    id="email"  
                                    label="Email" 
                                    disabled={!isEdit} 
                                    value={email} 
                                    onChange={handleInputChange} 
                                />
                                <div className="text-end">
                                    {isEdit ? <span>
                                        <Button text="Change Password" onClick={()=> history.push("/change password/" + username)}/>
                                        <CancelButton text="Cancel" isSuccess={isSuccess} onClick={handleCancel} />
                                        <SubmitButton text="Save" />
                                    </span> : <EditButton text="Edit" onClick={()=> setEdit(true)} />}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </center>
        </div> 
    )
}