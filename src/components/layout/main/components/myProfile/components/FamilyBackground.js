import Spouse from "./components/familyBackground/Spouse";
import Mother from "./components/familyBackground/Mother";
import Father from "./components/familyBackground/Father";
import Children from "./components/familyBackground/children/Children";
import { useParams } from "react-router-dom";
import React from 'react';

export default function FamilyBackground(){

    const { tab } = useParams();
    const display = tab === "family background" ? true : false;

    const styles = {
        container: { 
            maxHeight: window.innerHeight - (window.innerHeight * 0.25), overflow: '' 
        }
    }

    return (
        display &&
        <div className="FamilyBackground" style={styles.container} >
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