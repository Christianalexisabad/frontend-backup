
import { pathContains } from "../../../../../utility/Functions";
import React from "react";
import Title from "../../../../forms/title/Title";
import BasicInfo from "./components/BasicInfo";
import { useHistory, useParams } from "react-router-dom";
import "./MyProfile.css";
import WorkInfo from "./components/WorkInfo";
import ContactInfo from "./components/ContactInfo";
import AddressInfo from "./components/AddressInfo";
import FamilyBackground from "./components/FamilyBackground";
import EducationalBackground from "./components/educationalBackground/EducationalBackground";

export default function MyProfile() {

    const history = useHistory();
    const display = pathContains("/pages/my%20profile/");
    const { session_id, tab } = useParams();

    const tabs = [
        {
            title: "basic information",
            component: <BasicInfo/>
        },
        {
            title: "work information",
            component: <WorkInfo />
        },
        {
            title: "contact information",
            component: <ContactInfo />
        },
        {
            title: "address",
            component: <AddressInfo />
        },
        {
            title: "family background",
            component: <FamilyBackground />
        },
        {
            title: "educational background",
            component: <EducationalBackground />
        },
    ];

    function renderHeader() {
        return (
            <ul className="tabMenu">
                {tabs.map((item, index) => {
                    
                    const { title } = item; 

                    const isTab = title === tab ? true : false;

                    return (
                        <li 
                            key={index}
                            className="tabItem"
                            style={{
                                color: isTab ? 'rgb(50, 150, 50)' : 'rgb(50, 50, 50)',
                                backgroundColor: isTab ? 'rgb(220, 250, 220)' : 'rgb(255, 255, 255)'
                            }}
                            onClick={() => history.push("/pages/my%20profile/" + title + "/" + session_id)}
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
                                    <ul className="m-0 p-0">
                                        {tabs.map((item, index)=> {

                                            const { title, component } = item;

                                            return (
                                                title === tab &&
                                                <li key={index}>
                                                    {component}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}