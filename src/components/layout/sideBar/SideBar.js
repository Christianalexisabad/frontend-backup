import { getPosition, getSessionID, getUserID, getUserInfo } from "../../../utility/Session";
import SideMenu from "./sideMenu/SideMenu";
import React, { useEffect, useState } from "react";
import "./SideBar.css";
import { toCapitalized } from "../../../utility/Functions";
import { createUserAcitivity, getHost } from "../../../utility/APIService";
import { useHistory } from "react-router-dom";
import { createHistory, currentURL, getHistory } from "../../../utility/History";

export default function SideBar(props) {

    const [data, setData] = useState({});
    const history = useHistory();

    useEffect(() => {
        getUserInfo().then(response => {
            const { data } = response;
            setData(data);
        })    
    }, [])

    const { sur_name, first_name, image } = data; 
    const imageURL = getHost() + image;
    const name = toCapitalized(first_name + " " + sur_name)

    const handleClick = (e) => {
        e.preventDefault();

        createUserAcitivity(
            getUserID(), 
            "Profile", 
            "Visit",
            "Visited employee profile", 
        )

        if (currentURL() !== getHistory()) {
            createHistory();
        }

        history.push("/pages/my profile/" + getSessionID())
    }

    return (
        <div className="SideBar">
            <div className="row">
                <div className="col-lg-12">
                    <div className="header">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="title">eCandoni</h1>
                            </div>
                        </div>
                        <div className="row avatar">
                            <div className="col-lg-5 col-left">
                                <img 
                                    src={imageURL} 
                                    alt="" 
                                    title="Go to profile" 
                                    onClick={handleClick}
                                />
                            </div>
                        <div className="col-lg-7 col-right">
                                <p className="name text-capitalize">{name}</p>
                                <p className="position">{getPosition()}</p>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
            <div className="row row-2">
                <div className="col-lg-12">
                    <SideMenu hasPermission={props.hasPermission}/>
                </div>
            </div>
        </div>
    );
};