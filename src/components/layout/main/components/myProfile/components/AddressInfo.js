import React from "react";
import Permanent from "./components/address/Permanent";
import Residential from "./components/address/Residential";

export default function AddressInfo(){

    const WH = window.innerHeight;

    const styles = {
        container: { 
            maxHeight: WH - (WH * 0.25), 
            overflow: 'hidden',
        }
    }

    return (
        <div className="AddressInfo" style={styles.container}>
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