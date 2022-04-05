import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { getEmployeeID, getUserID } from "../../../utility/Session";
import { getDateTime } from "../../../utility/DateTime";
import { MY_FILE } from "../../../utility/Route";

const UploadFile = (props) => {

    const { onCancel , to } = props;
    const HOST = getHost();
    const initialData = {
        file: null,
        fileName: "",
        fileSize: null,
        fileType: null,
        fileURL: "",
        description: "",
    }

    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [departmentID, setDepartmentID] = useState(null);

    const fetchDepartmentID = async () => {
        const response = await axios.get(HOST + "/api/employees/get-department-id/" + getEmployeeID() + "/")
        const { data } = await response.data;
        setDepartmentID(data); 
    }

    useEffect(() => {
        fetchDepartmentID();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

    let {
        file,
        fileName,
        fileSize,
        fileType,
        fileURL,
        description,
    } = data;

    const handleInputChange = (e) => {

        let { id, type , files, value } = e.target;        

        if (type === 'file') {

            let file = files[0];

            let fileName = file.name;
            let fileSize = Math.round(file.size / 1024);
            let fileType = fileName.split(".")[1].toUpperCase() + " file(." + fileName.split(".")[1] +")";

            setData({ 
                ...data, 
                [id]: files[0], 
                fileName: fileName.split(".")[0],  
                fileType: fileType,
                fileSize: fileSize === 0 ? file.size : fileSize,
                fileURL: URL.createObjectURL(file)
            });
        } else {
            setData({ ...data, [id]: value });        
        }     
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

        if (isSuccess) {
            clearData();
        } else {

            if (!fileSize) {
                setDialogMessage("");
            }

            const user = getUserID();

            const isMyFiles = isPath(MY_FILE);

            let data = new FormData();
            data.append("name", fileName);
            data.append("description", description);
            data.append("type", fileType);
            data.append("size", fileSize);
            data.append("path", file, fileName);
            data.append("date_uploaded", getDateTime());
            isMyFiles ? data.append("user", user) : data.append("department", departmentID);

            axios.post(getHost() + "/api/" + to + "/new/", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(res => {
                window.location.reload();
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Upload File"
                                    onClick={() => {
                                        setData(initialData);
                                        onCancel();
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
                                    <ImageUploader 
                                        id="file"
                                        src={fileURL} 
                                        onChange={handleInputChange}
                                    />
                                    <Input 
                                        type="text" 
                                        id="fileName"
                                        label="File Name"
                                        value={fileName} 
                                        disabled={true}
                                    />
                                    <Input 
                                        id="description"
                                        label="Description"
                                        type="text" 
                                        value={description} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        label="File Type"
                                        disabled={true}
                                        type="text" 
                                        value={fileType}    
                                    />
                                    <Input 
                                        disabled={true}
                                        label="File Size (KB)"
                                        type="text" 
                                        value={fileSize && fileSize.toLocaleString()}       
                                    />
                                    <div className="btnContainer">
                                        <CancelButton display={false} text="Clear" onClick={()=> setData(initialData)} />
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

export default UploadFile;