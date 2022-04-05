import DialogBox from "../../../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../../../utility/APIService";
import Select from "../../../../../../../forms/select/Select";
import Input from "../../../../../../../forms/input/Input";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SubmitButton from "../../../../../../../forms/submitButton/SubmitButton";
import CancelButton from "../../../../../../../forms/cancelButton/CancelButton";
import Button from "../../../../../../../forms/button/Button";
import { useParams } from "react-router-dom";
import { isDataChanged } from "../../../../../../../../utility/Functions";

export default function Residential(){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState({});
    const [initialData, setInitialData] = useState({});

    const {
        id,
        subd_village,
        house_blk_lot_no,
        street,
        barangay,
        city,
        province,
        country,
    } = data;

    const [isEditable, setEditable] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const disabled = isEditable ? false : true;

    const [Barangays, setBarangays] = useState([]);
    const [Cities, setCities] = useState([]);
    const [Provinces, setProvinces] = useState([]);
    const [Countries, setCountries] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/residential-address/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
        setInitialData(data);
    }, [ employee ])

    const fetchBarangays = async () => {
        const response = await axios.get(getHost() + "/api/barangays/");
        const { data } = await response.data;
        setBarangays(data);
    }

    const fetchCities = async () => {
        const response = await axios.get(getHost() + "/api/cities/");
        const { data } = await response.data;
        setCities(data);
    }

    const fetchProvinces = async () => {
        const response = await axios.get(getHost() + "/api/provinces/");
        const { data } = await response.data;
        setProvinces(data);
    }

    const fetchCountries = async () => {
        const response = await axios.get(getHost() + "/api/countries/");
        const { data } = await response.data;
        setCountries(data);
    }

    useEffect(() => {
        fetchCountries();
        fetchProvinces();
        fetchCities();
        fetchBarangays();
        fetchData();
    }, [ fetchData ])

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setData({ ...data, [id]: value })
    }


    function postData () {
        axios.post(HOST + "/api/residential-address/new/", {
            employee: employee,
            subd_village: subd_village,
            house_blk_lot_no: house_blk_lot_no,
            street: street,
            barangay: barangay,
            city: city,
            province: province,
            country: country,
        }).then(res => {
            setMessage(res.data.message);
            setSuccess(true);
        }).catch(err => {
            console.log(err)
        })
    }

    function patchData () {
        axios.patch(HOST + "/api/residential-address/update/" + id + "/", {
            subd_village: subd_village,
            house_blk_lot_no: house_blk_lot_no,
            street: street,
            barangay: barangay,
            city: city,
            province: province,
            country: country,
        }).then(res => {
            setMessage(res.data.message);
            setSuccess(true);
        }).catch(err => {
            console.log(err)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSuccess) {
            setMessage("");
            setSuccess(false);
        } else {
            if (id) {
                patchData();
            } else {
                postData();
            }
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        if (!isDataChanged(initialData, data)) {
            setMessage("");
            setEditable(false);
        }
        setData(initialData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Residential Address </span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                    </h1>
                    <Button 
                        text="edit"
                        display={!isEditable}
                        permission="can_edit_employee"
                        onClick={() => setEditable(true)} 
                    />
                    <CancelButton 
                        text="cancel" 
                        display={isEditable}
                        onClick={handleCancel}
                    />
                    <SubmitButton 
                        text={isSuccess ? "Ok" : "Save"}
                        display={isEditable} 
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <DialogBox 
                        message={message} 
                        isSuccess={isSuccess}
                        onClose={() => setMessage("")}
                    />
                    <Input 
                        required
                        label="House/Block/Lot No"
                        type="text" 
                        id="house_blk_lot_no" 
                        placeholder="House/Block/Lot No" 
                        value={house_blk_lot_no} 
                        disabled={disabled} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        label="Street"
                        type="text" 
                        id="street" 
                        placeholder="Street"
                        disabled={disabled} 
                        value={street} 
                        onChange={handleInputChange} 
                    />
                    <Input 
                        required
                        label="Subd/Village"
                        type="text" 
                        id="subd_village" 
                        placeholder="Subd/Village"
                        disabled={disabled} 
                        value={subd_village} 
                        onChange={handleInputChange} 
                    />
                    <Select 
                        required
                        label="Barangay" 
                        id="barangay" 
                        value={barangay} 
                        disabled={disabled}
                        options={Barangays} 
                        onChange={handleInputChange} 
                    />
                    <Select 
                        required
                        label="City" 
                        id="city" 
                        value={city}  
                        options={Cities} 
                        disabled={disabled}
                        onChange={handleInputChange} 
                    />
                    <Select 
                        required
                        label="Province" 
                        id="province" 
                        value={province}  
                        disabled={disabled}     
                        options={Provinces} 
                        onChange={handleInputChange} 
                    />
                    <Select 
                        required
                        label="Country" 
                        id="country" 
                        value={country}  
                        disabled={disabled}
                        options={Countries} 
                        onChange={handleInputChange} 
                    />
                </div>
            </div>
        </form>
    )
   
}