import React from "react";
import { useParams } from "react-router-dom";
import Permanent from "./components/address/Permanent";
import Residential from "./components/address/Residential";

export default function AddressInfo(){

    const { tab } = useParams();
    const display = tab === "address" ? true : false;

    const WH = window.innerHeight;

    const styles = {
        container: { 
            maxHeight: WH - (WH * 0.25), 
            overflowX: 'hidden',
            overflowY: 'auto'
        }
    }

    return (
        display &&
        <div className="AddressInfo" style={styles.container}>
            <div className="row">
                <div className="col-lg-12" >
                    <Permanent />
                </div>  
            </div>
            <div className="row">
                <div className="col-lg-12" >
                    <Residential />
                </div>
            </div>
        </div>
    )   
}