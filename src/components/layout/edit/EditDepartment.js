import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { getLocation, Name, pathContains } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Select from "../../forms/select/Select";
import Title from "../../forms/title/Title";
import axios from "axios";

import "./Style.css";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { useHistory, useParams } from "react-router-dom";
import CreateLocation from "../createForm/CreateLocation";
import { ADD_EMPLOYEE, CREATE_LOCATION } from "../../../utility/Route";

const EditDepartment = () => {

    const { id } = useParams();
    const display = pathContains("/pages/department/departments/") && id !== undefined;
    const [deptID, setDeptID] = useState(null);
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [Locations, setLocations] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [createLocation, setCreateLocation] = useState(false);
    const HOST = getHost();

    const fetchData = useCallback(async () => {
      
        const response = await axios.get(HOST + "/api/departments/get/" + id +"/");
        let { data } = await response.data;
      
        data['location'] = data.location && data.location.id;
       
        setData(data);
    
    }, [ HOST, id ])

    const fetchLocations = useCallback(async () => {
        
        const response = await axios.get(HOST + "/api/locations/");
        const { data } = await response.data;

        let locations = [];

        for (const item of data) {
            locations.push({
                id: item.id,
                value: getLocation(item)
            })
        }

        setLocations(locations);

    }, [ HOST ])
  
    const fetchEmployees = useCallback(async () => {
        
        const response = await axios.get(getHost() + "/api/employees/");
        const { data } = await response.data;

        let employees = [];

        for (const item of data) {

            const { id, employee_no } = item;

            employees.push({
                value: id,
                label: Name(item) + "("+ employee_no +")"
            })
        }

        setEmployees(employees);
    }, []);
    
    useEffect(() => {
        if (display) {
            fetchData();
            fetchLocations();
            fetchEmployees();
        }
    }, [ display, fetchLocations, fetchData, fetchEmployees ]);


    let {
        department_head_id,
        email,
        image,
        imageURL,
        name,
        location,
        tel_no,
    } = data;

    const handleInputChange = (event) => {

        const { id, type , files, value } = event.target;

        if (type === 'file') {

            const file = files[0];
            const fileType = file.type;
            const fileURL = URL.createObjectURL(file)

            if (fileType.search("image") === -1) {
                setDialogMessage("Invalid file type.")
            } else {
                setData({ 
                    ...data, 
                    [id]: file, 
                    imageURL: fileURL, 
                });
            }

        } else {
            setData({ ...data, [id]: value });        
        }     
    }

    const handleClearInput = (event) => {
        event.preventDefault();
        setData({ ...data, [event.target.id]: ""});        
    }

    function clearData () {
        setMessage("");
        fetchData();
        setSuccess(false);
    }   

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (event) => { 
        event.preventDefault();

        if (isSuccess) {
            clearData();
        } else {
            if (!name) {   
                setDialogMessage("Name is required.")
            }else if (!location) {   
                setDialogMessage("Please select a location.")
            } else {
                const toUpdate = new FormData();
                toUpdate.append("name", name)
                toUpdate.append("department_head_id", department_head_id)
                toUpdate.append("location", location)
                toUpdate.append("email", email)
                toUpdate.append("tel_no", tel_no)

                if (typeof image !== "string") {
                    toUpdate.append("image  ", image, image.name)
                }

                axios.patch(HOST + "/api/departments/update/" + id + "/", toUpdate, {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                })
                .then(response => {
                    console.log(response);
                    setDialogMessage(response.data.message, true);
                }).catch(error => {
                    console.log(error);
                    setDialogMessage(error.response.data.message)
                })
            }
        }
    }

    const history = useHistory();

    if(createLocation){
        return <CreateLocation onClose={()=> setCreateLocation(false)}/>
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
                                    onClick={() => {
                                        setDeptID(null);
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
                                    <ImageUploader 
                                        src={!imageURL ? HOST + image : imageURL} 
                                        onChange={handleInputChange}
                                    />
                                    <Input 
                                        required
                                        id="name" 
                                        label="name"
                                        type="text" 
                                        value={name} 
                                        placeholder="Mayor's Office"
                                        onChange={handleInputChange} 
                                        onClear={handleClearInput }
                                    />
                                    <Select 
                                        id="department_head_id" 
                                        label="department head" 
                                        value={department_head_id} 
                                        refresh={()=> fetchEmployees()}
                                        createText="Add Employee" 
                                        create={ADD_EMPLOYEE}
                                        options={Employees}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="location" 
                                        label="location" 
                                        value={location} 
                                        refresh={()=> fetchLocations()}
                                        createText="Create Location" 
                                        create={CREATE_LOCATION}
                                        options={Locations}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="email" 
                                        label="email" 
                                        type="text" 
                                        value={email} 
                                        placeholder="johndoe@gmail.com"
                                        onChange={handleInputChange} 
                                        onClear={handleClearInput}
                                    />
                                    <Input 
                                        id="tel_no" 
                                        label="tel no" 
                                        type="text" 
                                        value={tel_no} 
                                        placeholder="444-444"
                                        onChange={handleInputChange} 
                                        onClear={handleClearInput}
                                    />
                                    <div className="btnContainer">
                                        {!isSuccess && <CancelButton text="Reset" onClick={()=> fetchData()} />}
                                        <SubmitButton type="submit" text={isSuccess ? "OK" : "Save"} />
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

export default EditDepartment;