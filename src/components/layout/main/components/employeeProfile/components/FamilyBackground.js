import Spouse from "./components/familyBackground/Spouse";
import Mother from "./components/familyBackground/Mother";
import Father from "./components/familyBackground/Father";
import React from 'react';
import Children from "./components/familyBackground/children/Children";

export default function FamilyBackground(props){
    return (
        <div className="FamilyBackground" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' }}>
            <div className="row m-2">
                <div className="col-lg-12">
                    <Spouse />
                </div>  
            </div>
            <div className="row m-2">
                <div className="col-lg-12">
                    <Children />
                </div>  
            </div>
            <div className="row m-2">
                <div className="col-lg-12">
                    <Father />
                </div>
            </div>
            <div className="row m-2">
                <div className="col-lg-12">
                    <Mother />
                </div>
            </div>
            <div className="row m-2">
                <div className="col-lg-12">
                </div>
            </div>
        </div>
    )   
}