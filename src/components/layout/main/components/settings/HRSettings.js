import { isPath } from "../../../../../utility/Functions";
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

export default function HRSettings(props) {

    const display = isPath("/pages/hr%20settings/");
    const [isActive, setActive] = useState({});

    const data = [
        { 
            id: 'general', 
            title: 'General',
            content: <div>
                <CivilStatus />  
                <hr />
                <NameExtension />
                <hr />
                <BloodType />  
                <hr />
                <Citizenship />  
            </div>
        },
        { 
            id: 'address', 
            title: 'Address',
            content: <div>
                <Location />
                <hr />
                <Country />
                <hr />
                <Province />
                <hr />
                <City />
                <hr />
                <Barangay />
            </div>
        },
        { 
            id: 'workInformation', 
            title: 'Work Information',
            content: <div>
                <EmployeeType />
                <hr />
                <Salary />
                <hr />
                <GovernmentCompany />
            </div>
        },
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

                    const active = isActive[item.id];

                    return (
                        <li key={index} className="listItem" >
                            <p 
                                onClick={()=> setActive({ ...isActive, [item.id]: active ? false : true })}
                                style={{ fontWeight: active ? 'bold' : 'normal', borderBottom: active ? '1px solid rgb(230, 230, 230)' : 'none' }}>
                                <span>{item.title}</span>
                                <i className={"item-toggle " +(active ? "fa fa-angle-down" : "fa fa-angle-left")}></i>
                            </p> 
                            {active && item.content}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}