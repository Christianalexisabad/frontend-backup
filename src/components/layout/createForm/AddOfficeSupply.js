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
import { ADD_MEASUREMENT_UNIT, ADD_OFFICE_SUPPLY, ADD_OFFICE_SUPPLY_ARTICLE, ADD_OFFICE_SUPPLY_TYPE } from "../../../utility/Route";
import { getEmployeeID } from "../../../utility/Session";

const AddOfficeSupply = () => {

    const display = isPath(ADD_OFFICE_SUPPLY);
    const HOST = getHost();

    const initialData = {
        image: {},
        imageURL: HOST + "/media/images/office/default.jpg",
        type: "",
        fund_name_code: "",
        description: "",
        stock_number: "",
        measurement_unit: "",
        article: "",
        unit_value: "",
        quantity: 0,
        total: 0,
        remarks: "",
        receipt: {},
    }

    const history = useHistory();
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [Articles, setArticles] = useState([]);
    const [stockNo, setStockNo] = useState(null);
    const [isSuccess, setSuccess] = useState(false);
    const [MeasurementUnits, setMeasurementUnits] = useState([]);

    const fetchStockNo = async () => {
        const response = await axios.get(HOST + "/api/office-supplies/stock-number/");
        const { data } = await response.data;
        setStockNo(data);
    }

    const fetchMeasurementUnits = async() => {
        const response = await axios.get(HOST + "/api/measurement-units/");
        const { data } = await response.data;
        setMeasurementUnits(data);
    }

    const [Types, setTypes] = useState([]);
    const fetchTypes = async() => {
        const response = await axios.get(HOST + "/api/office-supply-types/");
        const { data } = await response.data;
        setTypes(data);
    }

    const fetchArticles = async() => {
        const response = await axios.get(HOST + "/api/office-supply-articles/");
        const { data } = await response.data;
        setArticles(data);
    }

    useEffect(() => {
        if (display) {
        fetchMeasurementUnits();
        fetchTypes();
        fetchArticles();
        fetchStockNo();
        }
    }, [display]);

    let {
        type,
        image,
        imageURL,
        fund_name_code,
        description,
        stock_number,
        measurement_unit,
        article,
        unit_value,
        quantity,
        total,
        remarks,
        receipt,
        receiptURL
    } = data;

    const [stock, setStock] = useState({});

    useEffect(() => {
        if (type && article && measurement_unit) {
            axios.get(HOST + "/api/office-supply-stocks/verify/"+type+"/"+article+"/"+measurement_unit+"/")
            .then(response => {
                setStock(response.data.data)
            }).catch(err => {
                setStock(null)
            })
        }
    }, [type, article, measurement_unit])

    useEffect(() => {
        setData({ ...data, total: unit_value && quantity ? (quantity * unit_value).toFixed(2) : 0});
    }, [unit_value, quantity])

    const handleInputChange = (e) => {

        let { id, files, type, value } = e.target;

        if(type === 'file') {
            if (files[0].type.search("image") === -1) {
                setDialogMessage("File is not an image type.")
            } else {
                setData({ ...data, [id]: files[0], [id + "URL"]: URL.createObjectURL(files[0])});
            }
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
        setData(initialData);
        fetchStockNo();
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
            window.location.reload();
        } else {
            if (!image) {
                setDialogMessage("Please upload item image")
            }else if (!receipt) {
                setDialogMessage("Please upload attachement")
            }else if (!type) {
                setDialogMessage("Please select an item type")
            }else if (!article) {
                setDialogMessage("Please select an article")
            }else if (hasIllegalCharacters(article)) {
                setDialogMessage("Article contains invalid characters")
            }else if (!fund_name_code) {
                setDialogMessage("Fund name/code is required")
            }else if (hasIllegalCharacters(fund_name_code)) {
                setDialogMessage("Fund name/code contains invalid characters")
            }else if (!description) {
                setDialogMessage("Description is required")
            }else if (hasIllegalCharacters(description)) {
                setDialogMessage("Description contains invalid characters")
            }else if (!measurement_unit) {
                setDialogMessage("Measurement unit is required")
            }else if (!unit_value) {
                setDialogMessage("Unit value must be a number")
            }else if (!quantity) {
                setDialogMessage("Please enter a quantity")
            }else if (!remarks) {
                setDialogMessage("Remarks is required")
            }else if (hasIllegalCharacters(remarks)) {
                setDialogMessage("Remarks contains invalid characters")
            } else {
                postData();                
            }
        }
    }

    function postData(){

        const path = "/api/office-supplies/new/"
        const header = { headers:  { "Content-Type": "multipart/form-data" } }
        const toCreate = new FormData();

        toCreate.append("type", type)
        toCreate.append("fund_name_code", fund_name_code)
        toCreate.append("stock_number", stockNo)
        toCreate.append("image", image, image.name)
        toCreate.append("receipt",  receipt, receipt.name)
        toCreate.append("article", article)
        toCreate.append("description", description)
        toCreate.append("measurement_unit", measurement_unit)
        toCreate.append("unit_value", unit_value)
        toCreate.append("on_hand_per_count", quantity)
        toCreate.append("total", total)
        toCreate.append("remarks", remarks)
        toCreate.append("created_at", getDateTime())

        axios.post(HOST + path, toCreate, header)
        .then(res => {
            
            if (stock) {
                updateStock({
                    "quantity": parseInt(stock.quantity) + parseInt(quantity),
                    "last_modified": getDateTime(),
                    "modified_by": getEmployeeID(),
                })
            } else {
                createStock({
                    "description": description,
                    "unit_value": unit_value,
                    "quantity": quantity,
                    "last_modified": getDateTime(),
                    "modified_by": getEmployeeID(),
                    "type": type,
                    "article": article,
                    "measurement_unit": measurement_unit,
                });
            }

            setSuccess(true);
            setDialogMessage(res.data.message, true);
 
        }).catch(err => {
            setDialogMessage(err.response.data.message);
        })
    }

    function createStock(data){
        axios.post(HOST + "/api/office-supply-stocks/new/", data).then(res => {
        }).catch(err => {
        })
    }

    function updateStock(data){
        axios.patch(HOST + "/api/office-supply-stocks/update/"+ stock.id +"/", data).then(res => {
        }).catch(err => {
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
                                    text="Add New Stock"
                                    onClick={() => {
                                        setMessage("");
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
                                <form onSubmit={handleSubmit} >
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                        <p className="stock-number">Stock No: <span style={{ 
                                            border: '1px solid grey', padding: '0 20px', borderRadius: '3px', fontWeight: 'bold'
                                        }}>{stockNo}</span> </p>
                                        <ImageUploader 
                                            id="image"
                                            src={imageURL} 
                                            label="Item Image"
                                            onChange={handleInputChange}
                                        />

                                        <Attachement 
                                            id="receipt"
                                            url={receiptURL}
                                            value={receipt && receipt.name}
                                            label="Attachement"
                                            onChange={handleInputChange}
                                        />
                                        <Select 
                                            label="type" 
                                            id="type" 
                                            refresh={()=> fetchTypes()}
                                            createText="Add Type" 
                                            create={ADD_OFFICE_SUPPLY_TYPE}
                                            value={type}
                                            options={Types} 
                                            onChange={handleInputChange} 
                                        />
                                {stock && stock.id}


                                        <Select 
                                            label="article" 
                                            type="text" 
                                            id="article" 
                                            refresh={()=> fetchArticles()}
                                            createText="Add Artice" 
                                            create={ADD_OFFICE_SUPPLY_ARTICLE}
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
                                        <Select 
                                            label="measurement unit" 
                                            id= "measurement_unit" 
                                            refresh={()=> fetchMeasurementUnits()}
                                            createText="Add Measurement Unit" 
                                            create={ADD_MEASUREMENT_UNIT}
                                            value={measurement_unit}
                                            options={MeasurementUnits} 
                                            onChange={handleInputChange} 
                                        />
                                        <Input 
                                            label="unit value" 
                                            type="number" 
                                            id="unit_value" 
                                            value={unit_value} 
                                            placeholder="Cost per unit" 
                                            onChange={handleInputChange} 
                                        />
                                        <Input 
                                            label="Quantity" 
                                            type="number" 
                                            id="quantity" 
                                            value={quantity} 
                                            placeholder="Quantity"
                                            onChange={handleInputChange} 
                                        />
                                        <Input 
                                            label="Total Amount" 
                                            type="text"
                                            disabled={true} 
                                            value={total} 
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
                                        <CancelButton text="Clear" onClick={()=> setData(initialData)} />
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

export default AddOfficeSupply;