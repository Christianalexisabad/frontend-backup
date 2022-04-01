import { isPath, pathContains } from "../../../../../utility/Functions";
import React, { useState } from "react";
import "./Settings.css";
import Salary from "../table/Salary";
import CivilStatus from "../table/CivilStatus";
import EmployeeType from "../table/EmployeeType";
import LeaveType from "../table/LeaveType";
import LeaveBalance from "../table/LeaveBalance";
import NameExtension from "../table/NameExtension";
import Location from "../table/Location";
import City from "../table/City";
import Country from "../table/Country";
import Barangay from "../table/Barangay";
import BloodType from "../table/BloodType";
import Citizenship from "../table/Citizenship";
import Province from "../table/Province";
import GovernmentCompany from "../table/GovernmentCompany";
import AttendanceSettings from "../table/AttendanceSettings";
import { useHistory, useLocation, useParams } from "react-router-dom";

export default function HRSettings(props) {

    const display = pathContains("/pages/hr%20settings/");
    const history = useHistory();
    const { tab, session_id } = useParams();
    let { pathname } = useLocation();

    const data = [
        // { 
        //     id: 'general', 
        //     path: '/pages/hr settings/general',
        //     title: 'General',
        //     content: <div>
        //         <CivilStatus />  
        //         <hr />
        //         <NameExtension />
        //         <hr />
        //         <BloodType />  
        //         <hr />
        //         <Citizenship />  
        //     </div>
        // },
        // { 
        //     id: 'address', 
        //     path: '/pages/hr settings/address',
        //     title: 'Address',
        //     content: <div>
        //         <Location />
        //         <hr />
        //         <Country />
        //         <hr />
        //         <Province />
        //         <hr />
        //         <City />
        //         <hr />
        //         <Barangay />
        //     </div>
        // },
        // { 
        //     id: 'workInformation', 
        //     path: '/pages/hr settings/work information',
        //     title: 'Work Information',
        //     content: <div>
        //         <EmployeeType />
        //         <hr />
        //         <Salary />
        //         <hr />
        //         <GovernmentCompany />
        //     </div>
        // },
        { 
            id: 'leave', 
            title: 'Leave',
            content: <div>
                <LeaveType />
                <hr />
                <LeaveBalance />
            </div>
        },
        { 
            id: 'attendance', 
            title: 'Attendance',
            content: <div>
                <AttendanceSettings />
            </div>
        },
    ]
 
     return (
        display &&
        <div className="Settings">
            <ul className="list m-0 p-0">
                {data.map((item, index) => {

                    const { id, title } = item;
                    const isActive = id === tab ? true : false;

                    return (
                        <li key={index} className="listItem" >
                            <p 
                                onClick={
                                    e => {
                                        e.preventDefault();

                                        let path = "/pages/hr settings/" + session_id;
                                        
                                        if (!isActive){
                                            path = "/pages/hr settings/" + id + "/" + session_id;
                                        }

                                        history.push(path);

                                    }
                                }
                                style={{ 
                                    fontWeight: isActive ? 'bold' : 'normal', 
                                    borderBottom: isActive ? '1px solid rgb(230, 230, 230)' : 'none' 
                                }}
                                // (active ? "fa fa-angle-down" : "fa fa-angle-left")
                            >
                                <span>{title}</span>
                                <i className={"item-toggle "}></i>
                            </p> 
                            {isActive && item.content}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}