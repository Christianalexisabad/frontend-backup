import Spouse from "./components/familyBackground/Spouse";
import Mother from "./components/familyBackground/Mother";
import Father from "./components/familyBackground/Father";
import React from 'react';
import Children from "./components/familyBackground/children/Children";
import { useParams } from "react-router-dom";

export default function FamilyBackground(props){

    const { tab } = useParams();
    const display = tab === "family background" ? true : false;

    const style = { 
        maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' 
    }

    return (
        display &&        
        <div className="FamilyBackground" style={style}>
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
        </div>
    )   
}