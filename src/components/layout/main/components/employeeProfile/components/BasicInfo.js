import { isAddress, isHeight, isName, isWeight } from "../../../../../../utility/Regex";
import { Sexes } from "../../../../../../utility/Constants";
import ImageUploader from "../../../../../forms/imageUploader/ImageUploader";
import SubmitButton from "../../../../../forms/submitButton/SubmitButton";
import CancelButton from "../../../../../forms/cancelButton/CancelButton";
import DialogBox from "../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../utility/APIService";
import Button from "../../../../../forms/button/Button";
import Select from "../../../../../forms/select/Select";
import Input from "../../../../../forms/input/Input";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ADD_BLOOD_TYPE, ADD_CITIZENSHIP, ADD_CITY, ADD_CIVIL_STATUS, ADD_NAME_EXTENSION } from "../../../../../../utility/Route";


export default function BasicInfo(props){

    const { employee, tab } = useParams();
    const display = tab === "basic information" ? true : false;

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isEditable, setEditable] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const HOST = getHost();

    const [Cities, setCities] = useState([]);
    const [NameExtensions, setNameExtensions] = useState([]);
    const [BloodTypes, setBloodTypes] = useState([]);
    const [CivilStatuses, setCivilStatuses] = useState([]);
    const [Citizenships, setCitizenhips] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let response = await axios.get(HOST + "/api/employees/" + employee + "/");
            let { data } = await response.data;
            data['imageURL'] = HOST + data.image;
            setData(data);
        } catch (error) {
            // console.log(error);   
        }
    }, [ HOST, employee ])

    const fetchNameExtensions = useCallback(async () => {
        const response = await axios.get(HOST + "/api/name-extensions/");
        const { data } = await response.data;
        setNameExtensions(data);
    }, [ HOST ])

    const fetchCitizenships = useCallback(async () => {
        const response = await axios.get(HOST + "/api/citizenships/");
        const { data } = await response.data;
        setCitizenhips(data);
    }, [ HOST ])

    const fetchCivilStatuses = useCallback(async () => {
        const response = await axios.get(HOST + "/api/civil-statuses/");
        const { data } = await response.data;
        setCivilStatuses(data);
    }, [ HOST])

    const fetchBloodTypes = useCallback(async () => {
        const response = await axios.get(HOST + "/api/blood-types/");
        const { data } = await response.data;
        setBloodTypes(data);
    }, [ HOST ])

    const fetchCities = useCallback(async () => {
        const response = await axios.get(HOST + "/api/cities/");
        const { data } = await response.data;
        setCities(data);
    }, [ HOST ])

    useEffect(() => {

        if (display){
            fetchNameExtensions();
            fetchBloodTypes();
            fetchCivilStatuses();
            fetchCitizenships();
            fetchData();
        }
        
    }, [ display, fetchNameExtensions, fetchBloodTypes, fetchCivilStatuses, fetchCities, fetchCitizenships, fetchData ])

    const {
        id,
        image,
        birthplace,
        birthdate,
        blood_type,
        citizenship,
        date_hired,
        first_name,
        imageURL,
        height,
        middle_name,
        name_extension,
        employee_no,
        civil_status,
        sur_name,
        sex,
        weight,
    } = data;


    const handleInputChange = (e) => {
        let { id, type, files, value } = e.target;

        if (type === "file") {
            setData({...data, [id]: files[0], imageURL: URL.createObjectURL(files[0])});
        } else {
            setData({...data, [id]: value});
        }
    }

    function setDialogMessage(message, status) {
        status = status ? status : false;
        setMessage(message);
        setSuccess(status);
        return status;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditable) {
            if (!sur_name) {
                setDialogMessage("Surname is required."); 
            }else if (!isName(sur_name)) {
                setDialogMessage("Surname contains invalid characters."); 
            }else if (!first_name) {
                setDialogMessage("First name is required."); 
            }else if (!isName(first_name)) {
                setDialogMessage("First name contains invalid characters."); 
            }else if (middle_name && !isName(middle_name)) {
                setDialogMessage("Middle name contains invalid characters."); 
            }else if (!sex) {
                setDialogMessage("Please select a sex."); 
            }else if (!birthdate) {
                setDialogMessage("Birthdate is required."); 
            }else if (birthplace && !isAddress(birthplace)) {
                setDialogMessage("Birthplace contains invalid characters."); 
            }else if (height && !isHeight(height)) {
                setDialogMessage("Please enter a valid height."); 
            }else if (weight && !isWeight(weight)) {
                setDialogMessage("Please enter a valid weight."); 
            }

            const formData = new FormData();
            typeof image !== 'string' && formData.append("image", image, image.name);
            formData.append("sur_name", sur_name);
            formData.append("first_name", first_name);
            formData.append("middle_name", middle_name);
            name_extension && formData.append("name_extension", name_extension);
            formData.append("sex", sex);
            formData.append("birthdate", birthdate);
            birthplace && formData.append("birthplace", birthplace);
            formData.append("height", height);
            formData.append("weight", weight);
            blood_type && formData.append("blood_type", blood_type);
            civil_status && formData.append("civil_status", civil_status);
            citizenship && formData.append("citizenship", citizenship);

            axios.patch(getHost() + "/api/employees/update/"+ id +"/", formData)
            .then(res => {
                setDialogMessage(res.data.message, true);
                setEditable(false);
                setSuccess(true);
            }).catch(err => {
                setDialogMessage(err.response.data.message);
            })

        } else {
            setDialogMessage();
            setEditable(false);
        }
    }

    const handleRefresh = (e) => {
        e.preventDefault();
        fetchData();
        setMessage("");
        setSuccess(false);
        setEditable(false);
    }

    return (
        display &&
        <div className="BasicInfo" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' }}>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="text-secondary">
                            <span>Basic Information </span>
                            <Button icon="fa fa-refresh" onClick={handleRefresh}/>
                        </h1>
                        {!isEditable && <Button 
                            text="edit"
                            onClick={() => setEditable(true)} 
                            permission="can_edit_employee"
                        />}
                        <CancelButton 
                            text="cancel" 
                            display={isEditable}
                            onClick={() => setEditable(false)} 
                        />
                        <SubmitButton 
                            text="Save" 
                            display={isEditable}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <DialogBox
                            isSuccess={isSuccess}
                            message={message}
                            onClose={()=> setMessage("")}
                        />
                        <div className="inputContainer">
                            <ImageUploader 
                                id="image"
                                src={imageURL} 
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            />
                            <Input 
                                label="Employee Number" 
                                type="text" 
                                labelBold
                                dark
                                value={employee_no} 
                                disabled={true}
                            />
                            <Input 
                                required
                                validate
                                id="sur_name" 
                                label="surname" 
                                type="text" 
                                value={sur_name} 
                                disabled={!isEditable}
                                placeholder="Surname" 
                                isValid={isName(sur_name)}
                                onChange={handleInputChange}
                            />
                            <Input 
                                required
                                validate
                                label="first name" 
                                type="text" 
                                id="first_name" 
                                value={first_name} 
                                disabled={!isEditable}
                                placeholder="First Name" 
                                isValid={isName(first_name)}
                                onChange={handleInputChange} 
                            />
                            <Input 
                                validate
                                label="middle name" 
                                type="text" 
                                id="middle_name" 
                                value={middle_name} 
                                disabled={!isEditable}
                                placeholder="Middle Name"
                                isValid={isName(middle_name)}
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="name extension" 
                                value={name_extension ? name_extension : null} 
                                id="name_extension" 
                                disabled={!isEditable}
                                options={NameExtensions} 
                                refresh={()=> fetchNameExtensions()}
                                createText="Add Name Extension"
                                create={ADD_NAME_EXTENSION}   
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="sex" 
                                id="sex" 
                                value={sex} 
                                disabled={!isEditable}
                                options={Sexes} 
                                onChange={handleInputChange} 
                            />
                            <Input 
                                label="date of birth" 
                                type="date" 
                                id="birthdate " 
                                value={birthdate} 
                                disabled={!isEditable}
                                placeholder="Middle Name" 
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="place of birth"  
                                id="birthplace" 
                                value={birthplace}  
                                disabled={!isEditable}
                                options={Cities} 
                                refresh={()=> fetchCities()}
                                createText="Add City"
                                create={ADD_CITY}   
                                onChange={handleInputChange} 
                            />
                            <Input 
                                label="height"
                                type="text" 
                                id="height" 
                                value={height} 
                                placeholder={"Value must be in centimeter(cm)"} 
                                disabled={!isEditable}
                                onChange={handleInputChange} 
                            />
                            <Input 
                                label="weight"
                                type="text" 
                                id="weight" 
                                value={weight} 
                                placeholder={"Value must be in kilogram(kg)"}
                                disabled={!isEditable}
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="blood type"
                                type="text" 
                                id="blood_type" 
                                value={blood_type} 
                                options={BloodTypes}
                                refresh={()=> fetchBloodTypes()}
                                createText="Add Blood Type"
                                create={ADD_BLOOD_TYPE}  
                                disabled={!isEditable}
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="civil status"
                                type="text" 
                                id="civil_status" 
                                value={civil_status} 
                                disabled={!isEditable}
                                options={CivilStatuses}
                                refresh={()=> fetchCivilStatuses()}
                                createText="Add Civil Status"
                                create={ADD_CIVIL_STATUS}  
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="citizenship"
                                type="text" 
                                id="citizenship" 
                                value={citizenship} 
                                disabled={!isEditable}
                                options={Citizenships}
                                refresh={()=> fetchCitizenships()}
                                createText="Add Citizenship"
                                create={ADD_CITIZENSHIP}  
                                onChange={handleInputChange} 
                            />
                            <Input 
                                label="date hired" 
                                type="text" 
                                value={date_hired} 
                                disabled={true}
                                onChange={handleInputChange} 
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )   
}