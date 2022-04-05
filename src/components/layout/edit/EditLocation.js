import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getDateTime, pathContains, Name } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { fetchData, getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import Select from "../../forms/select/Select";
import { ADD_BARANGAY, ADD_COUNTRY, EDIT_LOCATION, ADD_PROVINCE } from "../../../utility/Route";

const EditLocation = (props) => {

    const { id } = useParams();
    const history = useHistory();
    const display = pathContains(EDIT_LOCATION)

    const [data, setData] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    
    const [Barangays, setBarangays] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Provinces, setProvinces] = useState([]);
    const [Countries, setCountries] = useState([]);

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/locations/get/"+ id + "/");
        let { data } = await response.data;
        setData(data);
    }

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
            fetchData();
            fetchBarangays();
            fetchCites();
            fetchProvinces();
            fetchCountries();
        }
    }, [display])

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

        axios.patch(getHost() + "/api/locations/update/" + id + "/", {
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
        <div className="EditForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Edit Location"
                                    onClick={() => {
                                        setMessage("");
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
                                            text="Reset" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                fetchData();
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

export default EditLocation;