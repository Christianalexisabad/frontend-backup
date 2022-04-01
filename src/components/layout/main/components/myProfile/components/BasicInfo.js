import { isAddress, isHeight, isName, isWeight } from "../../../../../../utility/Regex";
import { BloodTypes, NameExtensions, Sexes } from "../../../../../../utility/Constants";
import ImageUploader from "../../../../../forms/imageUploader/ImageUploader";
import SubmitButton from "../../../../../forms/submitButton/SubmitButton";
import CancelButton from "../../../../../forms/cancelButton/CancelButton";
import DialogBox from "../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../utility/APIService";
import Button from "../../../../../forms/button/Button";
import Select from "../../../../../forms/select/Select";
import Input from "../../../../../forms/input/Input";
import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
import { getEmployeeID } from "../../../../../../utility/Session";

export default function BasicInfo(props){

    const [data, setData] = useState({});
    const employee = getEmployeeID();
    const [message, setMessage] = useState("");
    const [isEditable, setEditable] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const disabled = isEditable ? false : true;
    const HOST = getHost();

    const fetchData = useCallback(async () => {
        let response = await axios.get(HOST + "/api/employees/get/" + employee + "/");
        let { data } = await response.data;
        data['imageURL'] = HOST + data.image;
        setData(data);
    }, [ HOST, employee ])

    const {
        id,
        employee_no,
        birthplace,
        birthdate,
        blood_type,
        citizenship,
        date_joined,
        first_name,
        imageURL,
        height,
        middle_name,
        name_extension,
        sur_name,
        sex,
        weight,
    } = data;

    useEffect(() => {
        fetchData();
    }, [ fetchData ])

    const handleInputChange = (e) => {
        let { id, type, files, value } = e.target;

        if (type === "file") {
            setData({...data, [id]: files[0], imageURL: URL.createObjectURL(files[0])});
        } else {
            setData({...data, [id]: value});
        }

    }

    const handleClearInput = (e) => {
        setData({ ...data, [e.target.id]: "" })
    }

    const handleSubmit = (e) => {
        e.preventDefault();


        if (isEditable) {
            if (!sur_name) {
                setMessage("Surname is required."); 
                setSuccess(false);
                return false;
            }else if (!isName(sur_name)) {
                setMessage("Surname contains invalid characters."); 
                setSuccess(false);
                return false;
            }else if (!first_name) {
                setMessage("First name is required."); 
                setSuccess(false);
                return false;
            }else if (!isName(first_name)) {
                setMessage("First name contains invalid characters."); 
                setSuccess(false);
                return false;
            }else if (middle_name && !isName(middle_name)) {
                setMessage("Middle name contains invalid characters."); 
                setSuccess(false);
                return false;
            }else if (!sex) {
                setMessage("Please select a sex."); 
                setSuccess(false);
                return false;
            }else if (!birthdate) {
                setMessage("Birthdate is required."); 
                setSuccess(false);
                return false;
            }else if (birthplace && !isAddress(birthplace)) {
                setMessage("Birthplace contains invalid characters."); 
                setSuccess(false);
                return false;
            }else if (height && !isHeight(height)) {
                setMessage("Please enter a valid height."); 
                setSuccess(false);
                return false;
            }else if (weight && !isWeight(weight)) {
                setMessage("Please enter a valid weight."); 
                setSuccess(false);
                return false;
            }

            axios.patch(getHost() + "/api/employees/update/"+ id +"/", {
                sur_name: sur_name,
                first_name: first_name,
                middle_name: middle_name,
                name_extension: name_extension,
                sex: sex,
                birthdate: birthdate,
                birthplace: birthplace,
                height: height,
                weight: weight,
                blood_type: blood_type,
                citizenship: citizenship,
            })
            .then(res => {
                setMessage(res.data.message);
                setSuccess(true);
                setEditable(false);
            }).catch(err => {
                setMessage(err.response.data.message);
                setSuccess(false);
            })

        } else {
            setMessage();
            setEditable(true);
        }
    }

    return (
        <div className="BasicInfo" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' }}>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="text-secondary">
                            <span>Basic Information </span>
                            <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
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
                                src={ imageURL } 
                                disabled={disabled}
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
                                disabled={disabled}
                                placeholder="Surname" 
                                isValid={isName(sur_name)}
                                onChange={handleInputChange}
                                onClear={handleClearInput}
                            />
                            <Input 
                                required
                                validate
                                label="first name" 
                                type="text" 
                                id="first_name" 
                                value={first_name} 
                                disabled={disabled}
                                placeholder="First Name" 
                                isValid={isName(first_name)}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                validate
                                label="middle name" 
                                type="text" 
                                id="middle_name" 
                                value={middle_name} 
                                disabled={disabled}
                                placeholder="Middle Name"
                                isValid={isName(middle_name)}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Select 
                                label="name extension" 
                                value={name_extension ? name_extension : null} 
                                id="name_extension" 
                                disabled={disabled}
                                options={NameExtensions} 
                                onChange={handleInputChange} 
                            />
                            <Select 
                                label="sex" 
                                id="sex" 
                                value={sex} 
                                disabled={disabled}
                                options={Sexes} 
                                onChange={handleInputChange} 
                            />
                            <Input 
                                label="date of birth" 
                                type="date" 
                                id="birthdate " 
                                value={birthdate} 
                                disabled={disabled}
                                placeholder="Middle Name" 
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                label="place of birth" 
                                type="text" 
                                id="birthplace" 
                                value={birthplace}  
                                placeholder="Place of Birth" 
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                label="height"
                                type="text" 
                                id="height" 
                                value={height} 
                                placeholder={"Value must be in centimeter(cm)"} 
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                label="weight"
                                type="text" 
                                id="weight" 
                                value={weight} 
                                placeholder={"Value must be in kilogram(kg)"}
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Select 
                                label="blood type"
                                type="text" 
                                id="blood_type" 
                                value={blood_type} 
                                options={BloodTypes}
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                label="citizenship"
                                type="text" 
                                id="citizenship" 
                                value={citizenship} 
                                placeholder="citizenship" 
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                            <Input 
                                label="date joined" 
                                type="text" 
                                value={date_joined} 
                                disabled={disabled}
                                onChange={handleInputChange} 
                                onClear={handleClearInput}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )   
}