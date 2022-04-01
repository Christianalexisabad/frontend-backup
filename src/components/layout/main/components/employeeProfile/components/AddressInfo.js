import React from "react";
import { useParams } from "react-router-dom";
import Permanent from "./components/address/Permanent";
import Residential from "./components/address/Residential";

export default function AddressInfo(props){

    const { tab } = useParams();
    const display = tab === "address" ? true : false;

    return (
        display &&
        <div className="AddressInfo" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' }}>
            <div className="row">
                <div className="col-lg-12">
                    <Permanent />
                </div>  
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <Residential />
                </div>
            </div>
        </div>
    )   
}