
import React from "react";
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
            component: <BasicInfo />
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
        {
            title: "leave",
            component: <Leave />
        },
        {
            title: "attendance",
            component: <Attendance />
        },
        {
            title: "benefits",
            component: <Benefits />
        },
        {
            title: "status",
            component: <Status />
        },
        {
            title: "user account",
            component: <UserProfile />
        },
    ];

    function renderTab() {
        return (
            <ul className="tabMenu">
                {tabs.map((item, index) => {
                    
                    const { title } = item; 

                    const tabStyle = {
                        color: title === tab ? 'rgb(50, 150, 50)' : 'rgb(50, 50, 50)',
                        backgroundColor: title === tab? 'rgb(220, 250, 220)' : 'rgb(255, 255, 255)'
                    }

                    const handleTabClick = event => {
                        event.preventDefault();
                        history.push("/pages/employee/employees/" + employee + "/" + title + "/" + session_id )
                    }

                    return (
                        <li 
                            key={ index }
                            className="tabItem"
                            style={tabStyle}
                            onClick={handleTabClick}
                        >
                            <span>{title}</span>
                        </li>
                    )
                })}
            </ul>
        )
    }

    function renderContent() {
        return (
            <div className="content">
                <BasicInfo />
                <WorkInfo />
                <ContactInfo />
                <AddressInfo />
                <FamilyBackground />
                <EducationalBackground />
                <Leave />
                <Attendance />
            </div>
        )
    }

    const styles = {
        container: { 
            height: window.innerHeight -(window.innerHeight * 0.15) 
        },
        content: { 
            overflow: 'auto' 
        }
    }

    return (
        display &&
        <div className="EmployeeProfile">
            <div className="container bg-white" style={styles.container}>
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
                    <div className="col-lg-4 p-0">
                        {renderTab()}
                    </div>
                    <div className="col-lg-8" style={styles.content}>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div> 
    )
}