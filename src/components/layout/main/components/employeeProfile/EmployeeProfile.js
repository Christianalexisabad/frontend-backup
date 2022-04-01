
import React, { useEffect, useState } from "react";
import Title from "../../../../forms/title/Title";
import BasicInfo from "./components/BasicInfo";
import { useHistory, useParams } from "react-router-dom";
import "./EmployeeProfile.css";
import WorkInfo from "./components/WorkInfo";
import ContactInfo from "./components/ContactInfo";
import AddressInfo from "./components/AddressInfo";
import FamilyBackground from "./components/FamilyBackground";
import EducationalBackground from "./components/educationalBackground/EducationalBackground";
import Leave from "./components/leave/Leave";
import Attendance from "./components/attendance/Attendance";
import Status from "./components/status/Status";
import Benefits from "./components/benefits/Benefits";
import UserProfile from "../../../edit/UserProfile";

export default function EmployeeProfile(props) {

    const history = useHistory();
    const { employee, tab, session_id } = useParams();

    const display = employee ? true : false;

    const tabs = [
        {
            title: "basic information", 
            content: <BasicInfo />
        },
        {
            title: "work information",
            content: <WorkInfo />
        },
        {
            title: "contact information",
            content: <BasicInfo />
        },
        {
            title: "address",
            content: <BasicInfo />
        },
        {
            title: "family background",
            content: <BasicInfo />
        },
        {
            title: "educational background",
            content: <BasicInfo />
        },
        {
            title: "leave",
            content: <BasicInfo />
        },
        {
            title: "attendance",
            content: <BasicInfo />
        },
        {
            title: "benefits",
            content: <BasicInfo />
        },
        {
            title: "status",
            content: <BasicInfo />
        },
        {
            title: "user account",
            content: <BasicInfo />
        },
    ];

    function renderHeader() {
        return (
            <ul className="tabMenu">
                {tabs.map((item, index) => {
                    
                    const { title } = item; 

                    return (
                        <li 
                            key={ index }
                            className="tabItem"
                            style={{
                                color: title === tab ? 'rgb(50, 150, 50)' : 'rgb(50, 50, 50)',
                                backgroundColor: title === tab? 'rgb(220, 250, 220)' : 'rgb(255, 255, 255)'
                            }}
                            onClick={
                                () => {
                                    history.push("/pages/employee/employees/" + employee + "/" + title + "/" + session_id )
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
        <div className="EmployeeProfile">
            <div className="container bg-white" style={{ height: window.innerHeight -(window.innerHeight * 0.15) }}>
                <div className="row p-0">
                    <div className="col-lg-12 p-0">
                        <div className="header">
                            <Title  
                                text="Employee Profile"
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
                                    <BasicInfo />
                                    <WorkInfo />
                                    <ContactInfo />
                                    <AddressInfo />
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    )
}