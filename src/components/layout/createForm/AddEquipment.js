import ImageUploader from "../../forms/imageUploader/ImageUploader";
import { isEmail, isTelNo, isName, hasIllegalCharacters, isDecimal, isInteger } from "../../../utility/Regex";
import { isPath, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Select from "../../forms/select/Select";
import Title from "../../forms/title/Title";
import axios from "axios"
import "./Style.css";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { useHistory } from "react-router-dom";
import { getDateTime } from "../../../utility/DateTime";
import Attachement from "../../forms/attachment/Attachement";
import { ADD_EQUIPMENT, ADD_EQUIPMENT_ARTICLE, ADD_EQUIPMENT_TYPE } from "../../../utility/Route";

const AddEquipment = () => {

    const display = isPath(ADD_EQUIPMENT);
    const HOST = getHost();

    const initialValues = {
        image: {},
        imageURL: HOST + "/media/images/office/default.jpg",
        type: "",
        fund_name_code: "",
        description: "",
        property_number: "",
        article: "",
        location: 0,
        condition: "",
        remarks: "",
        receipt: {},
    }

    const history = useHistory();
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [Articles, setArticles] = useState([]);
    const [Types, setTypes] = useState([]);

    const fetchData = async () => {
        const response = await axios.get(HOST + "/api/equipments/property-number/");
        const { data } = await response.data;
        setData({ ...data, property_number: data });
    }

    const fetchTypes = async() => {
        const response = await axios.get(HOST + "/api/equipment-types/");
        const { data } = await response.data;
        setTypes(data);
    }

    const fetchArticles = async() => {
        const response = await axios.get(HOST + "/api/equipment-articles/");
        const { data } = await response.data;
        setArticles(data);
    }

    useEffect(() => {
        if (display) {
        fetchTypes();
        fetchArticles();
        fetchData();
        }
    }, [display]);

    const {
        type,
        image,
        imageURL,
        fund_name_code,
        description,
        property_number,
        article,
        cost,
        condition,
        location,
        remarks,
        receipt,
    } = data;

    const handleInputChange = (e) => {

        let { id, files, value } = e.target;

        if(id === 'image') {
            if (files[0].type.search("image") === -1) {
                setDialogMessage("File is not an image type.")
            } else {
                setData({ ...data, [id]: files[0], [id + "URL"]: URL.createObjectURL(files[0])});
            }
        }else if(id === "receipt"){
            setData({ ...data, [id]: files[0]});
        }
        else{
            setData({ ...data, [id]: value });        
        }     
    }

    const handleClearInput = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: ""});        
    }

    function clearData () {
        setMessage("");
        setData(initialValues);
        setSuccess(false);
    }   

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success ? true : false;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
            if (!image) {
                setDialogMessage("Please upload item image")
            }else if (!receipt) {
                setDialogMessage("Please upload attachement")
            }else if (!type) {
                setDialogMessage("Please select an item type")
            }else if (!article) {
                setDialogMessage("Please select an article")
            }else if (!fund_name_code) {
                setDialogMessage("Fund name/code is required")
            }else if (!description) {
                setDialogMessage("Description is required")
            }else if (!(cost)) {
                setDialogMessage("Cost is required")
            }else if (!location) {
                setDialogMessage("Please enter a location")
            }else if (!condition) {
                setDialogMessage("Condition is required")
            }else if (!remarks) {
                setDialogMessage("Remarks is required")
            } else {
                postData();                
            }
        }
    }

    function postData(){

        const path = "/api/equipments/new/"
        const header = { headers:  { "Content-Type": "multipart/form-data" } }
        const toCreate = new FormData();

        toCreate.append("type", type)
        toCreate.append("fund_name_code", fund_name_code)
        toCreate.append("property_number", property_number)
        toCreate.append("image", image, image.name)
        toCreate.append("receipt",  receipt, receipt.name)
        toCreate.append("article", article)
        toCreate.append("description", description)
        toCreate.append("cost", cost)
        toCreate.append("condition", condition)
        toCreate.append("location", location)
        toCreate.append("remarks", remarks)
        toCreate.append("create_at", getDateTime())

        axios.post(HOST + path, toCreate, header)
        .then(res => {
            fetchData();
            setSuccess(true);
            setDialogMessage(res.data.message, true);
        }).catch(err => {
            setDialogMessage(err.response.data.message);
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
                                    text="Add Equipment"
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
                                <form onSubmit={handleSubmit} >
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                        <p className="property-number text-start">Property No: <span style={{ 
                                            border: '1px solid grey', padding: '0 20px', borderRadius: '3px', fontWeight: 'bold'
                                        }}>{property_number}</span> </p>
                                        <ImageUploader 
                                            id="image"
                                            src={imageURL} 
                                            label="Item Image"
                                            onChange={handleInputChange}
                                        />
                                        <Attachement 
                                            id="receipt"
                                            value={receipt && receipt.name}
                                            label="Attachement"
                                            onChange={handleInputChange}
                                        />
                                        <Select 
                                            label="type" 
                                            id="type" 
                                            refresh={()=> fetchTypes()}
                                            createText="Add Type" 
                                            create={ADD_EQUIPMENT_TYPE}
                                            value={type}
                                            options={Types} 
                                            onChange={handleInputChange} 
                                        />
                                        <Select 
                                            label="article" 
                                            type="text" 
                                            id="article" 
                                            refresh={()=> fetchArticles()}
                                            createText="Add Artice" 
                                            create={ADD_EQUIPMENT_ARTICLE}
                                            value={article} 
                                            options={Articles} 
                                            onChange={handleInputChange} 
                                        />
                                        <Input 
                                            label="Fund name/code" 
                                            type="text" 
                                            id="fund_name_code" 
                                            value={fund_name_code} 
                                            placeholder="The fund name/code" 
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                        <Input 
                                            label="description" 
                                            type="text" 
                                            id="description" 
                                            value={description} 
                                            placeholder="e.g., file tagboard for legal size, 210 mm x 297 mm (A4) min. of 70 gms" 
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                        <Input 
                                            label="unit value" 
                                            type="number" 
                                            id="cost" 
                                            value={cost} 
                                            placeholder="Cost" 
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                        <Input 
                                            label="location" 
                                            type="text" 
                                            id="location" 
                                            value={location} 
                                            placeholder="location"
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                        <Input 
                                            label="condition" 
                                            type="text" 
                                            id="condition" 
                                            value={condition} 
                                            placeholder="Condition"
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                        <Input 
                                            label="remarks" 
                                            type="text" 
                                            id="remarks" 
                                            value={remarks} 
                                            placeholder="Conditions and other relevant information"
                                            onChange={handleInputChange} 
                                            onClick={handleClearInput}
                                        />
                                    <div className="btnContainer">
                                        <CancelButton text="Clear" onClick={()=> setData(initialValues)} />
                                        <SubmitButton text={isSuccess ? "New" : "Save"}/>
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

export default AddEquipment;