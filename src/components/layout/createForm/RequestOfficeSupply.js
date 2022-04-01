import { getData } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useCallback, useEffect, useState } from "react";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios"
import "./Style.css";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { getEmployeeID } from "../../../utility/Session";
import { getCurrentDate } from "../../../utility/DateTime";

const initialValues = {
    id: null,
    description: "",
    unit_value: 0,
    type: null,
    article: null,
    measurement_unit: null,
    stock: null,
    quantity: 0,
    qty: 0,
    date_needed: "",
    requested_by: getEmployeeID(),
    request_date: ""
}

const RequestOfficeSupply = (props) => {

    const { stockID } = props;
    const HOST = getHost();
    // const employee = getEmployeeID();
    // const history = useHistory();
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const fetchData = useCallback(async() => {
        const response = await axios.get(HOST + "/api/office-supply-stocks/get/"+ stockID +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, stockID ])
    
    useEffect(() => {
        stockID ? fetchData() : setData(initialValues);
    }, [stockID, fetchData ]);

    const [Types, setTypes] = useState([]);
    const [Articles, setArticles] = useState([]);
    const [MeasurementUnits, setUnits] = useState([]);

    const fetchTypes = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-types/")
        setTypes(await response.data);
    }

    const fetchArticles = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-articles/")
        setArticles(await response.data);
    }

    const fetchUnits = async () => {
        const response = await axios.get(getHost() + "/api/measurement-units/")
        setUnits(await response.data);
    }

    useEffect(() => {
        fetchTypes();
        fetchArticles();
        fetchUnits();
    }, [])

    const {
        type,
        article,
        measurement_unit,
        quantity,
        qty,
        date_needed,
        requested_by,
        request_date
    } = data;
    
    useEffect(() => {
        qty > quantity ? setDialogMessage("Out of stock, Stocks available: " + quantity +".") : setDialogMessage("")
    }, [ qty, quantity ])

    useEffect(() => {
        date_needed < getCurrentDate() ? setDialogMessage("Date must be greater than current date") : setDialogMessage("")
    }, [date_needed])

    const handleInputChange = (e) => {

        let { id, files, value } = e.target;

        if(id === 'image') {
            if (files[0].type.search("image") === -1) {
                setDialogMessage("File is not an image type.")
            }else{
                setData({ ...data, [id]: files[0], [id + "URL"]: URL.createObjectURL(files[0])});
            }
        }else if(id === "receipt"){
            setData({ ...data, [id]: files[0]});
        }
        else{
            setData({ ...data, [id]: value });        
        }     
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
        }else{ 
            if (qty === 0 || !qty) {
                setDialogMessage("Please enter a quantity")
            } else if (qty > quantity) {
                setDialogMessage("Out of stock! Available: " + quantity + "")
            } else if (!date_needed) {
                setDialogMessage("Date needed is required")
            } else {
                postData();                
            }
        }
    }

    function postData(){

        const path = "/api/office-supply-requests/new/"
        axios.post(HOST + path, {
            stock: stockID,
            quantity: qty,
            date_needed: date_needed,
            requested_by: requested_by,
            request_date: request_date
        })
        .then(res => {
            setSuccess(true);
            setDialogMessage(res.data.message, true);
        }).catch(err => {
            setDialogMessage(err.response.data.message);
        })
    }

    return (
        stockID &&
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Request Office Supply"
                                    onClick={() => {
                                        setMessage("");
                                        setData(initialValues);
                                        props.onCancel();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <Input 
                                label="type" 
                                type="text" 
                                disabled={true}
                                value={getData(parseInt(type), "name", Types)} 
                            />
                            <Input 
                                label="article" 
                                type="text" 
                                disabled={true}
                                value={getData(parseInt(article), "name", Articles)} 
                            />
                            <Input 
                                label="measurement unit" 
                                type="text" 
                                disabled={true}
                                value={getData(parseInt(measurement_unit), "name", MeasurementUnits)} 
                            />
                            <Input 
                                label="available stocks" 
                                type="number" 
                                id="quantity" 
                                disabled={true}
                                value={quantity} 
                            />
                        </div>
                        <div className="col-lg-6">
                            <form onSubmit={handleSubmit} style={{ width: '70%'}}>
                                <DialogBox 
                                    message={message} 
                                    isSuccess={isSuccess}
                                    onClose={() => setMessage("")}
                                />
                                <Input 
                                    label="Quantity" 
                                    type="number" 
                                    id="qty" 
                                    value={qty} 
                                    placeholder="Quantity"
                                    onChange={handleInputChange} 
                                />
                                <Input 
                                    label="date needed" 
                                    type="date" 
                                    id="date_needed" 
                                    value={date_needed} 
                                    onChange={handleInputChange} 
                                />
                                <div className="btnContainer">
                                    <CancelButton text="Clear" onClick={()=> setData(initialValues)} />
                                    <SubmitButton text={isSuccess ? "New" : "Confirm"}/>
                                </div>
                            </form>  
                        </div>
                    </div>
                </div>
            </center>
        </div> 
    )
}

export default RequestOfficeSupply;