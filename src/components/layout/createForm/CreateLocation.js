import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import Select from "../../forms/select/Select";
import { ADD_BARANGAY, ADD_COUNTRY, CREATE_LOCATION, ADD_PROVINCE } from "../../../utility/Route";

const CreateLocation = (props) => {

    const history = useHistory();
    const display = isPath(CREATE_LOCATION)

    const initialData = {
        blk_lot_no: "",
        street: "",
        subd_village: "",
        barangay: null,
        city: null,
        province: null,
        country: null,
    }
    
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    
    const [Barangays, setBarangays] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Provinces, setProvinces] = useState([]);
    const [Countries, setCountries] = useState([]);

    const fetchBarangays = async () => {
        let response = await axios.get(getHost() + "/api/barangays/");
        let { data } = await response.data;
        setBarangays(data);
    }

    const fetchCites = async () => {
        let response = await axios.get(getHost() + "/api/cities/");
        let data = [];

        for (const item of await response.data) {
            data.push({
                id: item.id,
                value: item.zip_code + ", " + item.name
            })
        }

        setCities(data);
    }

    const fetchProvinces = async () => {
        let response = await axios.get(getHost() + "/api/provinces/");
        let { data } = await response.data;
        setProvinces(data);
    }

    const fetchCountries = async () => {
        let response = await axios.get(getHost() + "/api/countries/");
        let { data } = await response.data;
        setCountries(data);
    }

    useEffect(() => {
        if (display) {
            fetchCites();
            fetchBarangays();
            fetchProvinces();
            fetchCountries();
        }
    }, [ display ])

    const { 
        blk_lot_no,
        street,
        subd_village,
        barangay,
        city,
        province,
        country,
     }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });        
    }

    function setDialogMessage (message, success) {
        setMessage(message);     
        setSuccess(success);
        return success;
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        axios.post(getHost() + "/api/locations/new/", {
            blk_lot_no: blk_lot_no,
            street: street,
            subd_village: subd_village,
            barangay: barangay,
            city: city,
            province: province,
            country: country,
        }).then(res => {  
            setDialogMessage(res.data.message, res.status);
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
                                    text="Create Location"
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
                                <form onSubmit={handleSubmit}>
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                    <Input 
                                        id="blk_lot_no"
                                        label="Block/Lot No" 
                                        type="text" 
                                        value={blk_lot_no}
                                        placeholder="Lot 1, Block 2" 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="street"
                                        label="Street" 
                                        type="text" 
                                        value={street}
                                        placeholder="Bonifacio st." 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="subd_village"
                                        label="Subdivision/Village" 
                                        type="text" 
                                        value={subd_village}
                                        placeholder="La Villa de Guadalupe" 
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="barangay" 
                                        label="barangay" 
                                        value={barangay} 
                                        refresh={()=> fetchBarangays()}
                                        createText="Add Barangay" 
                                        create={ADD_BARANGAY}
                                        options={Barangays}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="city" 
                                        label="city" 
                                        value={city} 
                                        refresh={()=> fetchCites()}
                                        createText="Add City" 
                                        create={ADD_BARANGAY}
                                        options={Cities}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="province" 
                                        label="province" 
                                        value={province} 
                                        refresh={()=> fetchProvinces()}
                                        createText="Add Province" 
                                        create={ADD_PROVINCE}
                                        options={Provinces}
                                        onChange={handleInputChange} 
                                    />
                                    <Select 
                                        id="country" 
                                        label="country" 
                                        value={country} 
                                        refresh={()=> fetchCountries()}
                                        createText="Add Country" 
                                        create={ADD_COUNTRY}
                                        options={Countries}
                                        onChange={handleInputChange} 
                                    />
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialData);
                                            }}
                                        />
                                        <SubmitButton text="Save" /> 
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

export default CreateLocation;