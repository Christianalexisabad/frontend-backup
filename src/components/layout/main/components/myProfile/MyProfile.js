
import { isPath } from "../../../../../utility/Functions";
import React, { useState } from "react";
import Title from "../../../../forms/title/Title";
import BasicInfo from "./components/BasicInfo";
import { useHistory } from "react-router-dom";
import "./MyProfile.css";
import WorkInfo from "./components/WorkInfo";
import ContactInfo from "./components/ContactInfo";
import AddressInfo from "./components/AddressInfo";
import FamilyBackground from "./components/FamilyBackground";
import EducationalBackground from "./components/educationalBackground/EducationalBackground";

export default function MyProfile() {

    const history = useHistory();
    const display = isPath("/pages/my%20profile/");

    const [tab, setTab] = useState(0);

    const tabItem = [
        {
            id: 0,
            title: "basic information",
        },
        {
            id: 1,
            title: "work information",
        },
        {
            id: 2,
            title: "contact information",
        },
        {
            id: 3,
            title: "address",
        },
        {
            id: 4,
            title: "family background",
        },
        {
            id: 5,
            title: "educational background",
        },
    ];

    function renderHeader() {
        return (
            <ul className="tabMenu">
                {tabItem.map(item => {
                    
                    let { id, title } = item; 

                    return (
                        <li 
                            key={id}
                            className="tabItem"
                            style={{
                                color: id === tab ? 'rgb(50, 150, 50)' : 'rgb(50, 50, 50)',
                                backgroundColor: id === tab? 'rgb(220, 250, 220)' : 'rgb(255, 255, 255)'
                            }}
                            onClick={
                                () => {
                                    setTab(id);
                                }
                            }
                        >
                            <span>{title}</span>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        display &&
        <div className="MyProfile">
            <div className="container bg-white" style={{ height: window.innerHeight -(window.innerHeight * 0.15) }}>
                <div className="row p-0">
                    <div className="col-lg-12 p-0">
                        <div className="header">
                            <Title  
                                text="My Profile"
                                onClick={()=> history.goBack()}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="content">
                            <div className="row">
                                <div className="col-lg-4 p-0">
                                    {renderHeader()}
                                </div>
                                <div className="col-lg-8" style={{ overflow: 'auto' }}>
                                    {
                                        tab === 0 ?
                                        <BasicInfo /> : 
                                        tab === 1 ? 
                                        <WorkInfo /> :
                                        tab === 2 ? 
                                        <ContactInfo /> : 
                                        tab === 3 ? 
                                        <AddressInfo /> :
                                        tab === 4 ? 
                                        <FamilyBackground /> : <EducationalBackground />
                                    }
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}