import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { getLocation, hasChanges, isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Select from "../../forms/select/Select";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { useHistory } from "react-router-dom";
import CreateLocation from "./CreateLocation";
import { ADD_DEPARTMENT, CREATE_LOCATION } from "../../../utility/Route";
import { isName } from "../../../utility/Regex";

const initialData = {
    name: "",
    image: null,
    department_head: null,
    location: "",
    email: "",
    tel_no: "",
}

const AddDepartment = () => {

    const display = isPath(ADD_DEPARTMENT);
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [Locations, setLocations] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [createLocation, setCreateLocation] = useState(false);

    const fetchLocations = async () => {
        const response = await axios.get(getHost() + "/api/locations/");
        const { data } = await response.data;

        let locations = [];

        for (const item of data) {
            locations.push({
                id: item.id,
                value: getLocation(item)
            })
        }
    
        setLocations(locations);
    }
  
    const fetchEmployees = async () => {
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
    }

    useEffect(() => {
        if (display){
            fetchLocations();
            fetchEmployees();
        }
    }, [ display ]);

    let {
        email,
        image,
        department_head,
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
                setData({...data, [id]: file,  imageURL: fileURL });
            }

        } else {
            setData({ ...data, [id]: value });        
        }     
    }

    // error message
    const [err, setErr] = useState({});

    useEffect(() => {

        let error = !name ? "Required" : "";

        if (name && !isName(name)) {
            error = "Contains invalid characters."
        }

        if (error !== err.name) {
            setErr({ ...err, name: error });
        }

    }, [ err, err.name, name ]);

    useEffect(() => {

        let error = !tel_no ? "Required" : "";

        if (error !== err.tel_no) {
            setErr({ ...err, tel_no: error });
        }

    }, [ err, err.tel_no, tel_no ]);

    useEffect(() => {

        let error = !location ? "Required" : "";

        if (error !== err.location) {
            setErr({ ...err, location: error });
        }

    }, [ err, err.location, location ]);

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

                const formData = new FormData();

                formData.append("name", name)
                formData.append("location", location)
                formData.append("email", email)
                formData.append("tel_no", tel_no)

                if (image && typeof image !== "string") {
                    formData.append("image", image, image.name) 
                }

                if (department_head) {
                    formData.append("department_head_id", department_head)
                }
                
                axios.post(getHost() + "/api/departments/new/", formData, {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                })
                .then(response => {
                    setDialogMessage(response.data.message, true);
                    // console.log(response);
                }).catch(error => {
                    setDialogMessage(error.response.data.message)
                    // console.log(error);
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
                                    text="Add New Department"
                                    onClick={() => {
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
                                    <ImageUploader 
                                        src={imageURL} 
                                        onChange={handleInputChange}
                                    />
                                    <Input 
                                        errMessage={err.name}
                                        id="name" 
                                        label="name"
                                        type="text" 
                                        value={name} 
                                        placeholder="Mayor's Office"
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="department_head" 
                                        label="department head" 
                                        value={department_head}
                                        options={Employees}
                                        refresh={()=> fetchEmployees()}
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="email" 
                                        label="email" 
                                        type="text" 
                                        value={email} 
                                        placeholder="johndoe@gmail.com"
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        errMessage={err.tel_no}
                                        id="tel_no" 
                                        label="tel no" 
                                        type="text" 
                                        value={tel_no} 
                                        placeholder="444-444"
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        errMessage={err.location}
                                        id="location" 
                                        label="location" 
                                        value={location} 
                                        refresh={()=> fetchLocations()}
                                        createText={"Create Location"}
                                        create={CREATE_LOCATION}
                                        options={Locations}
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            display={hasChanges(data)} 
                                            text="Reset" 
                                            onClick={()=> setData(initialData)} 
                                        />
                                        <SubmitButton 
                                            disabled={hasChanges(err)} 
                                            text={isSuccess ? "New" : "Save"} 
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

export default AddDepartment;