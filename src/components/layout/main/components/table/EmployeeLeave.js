
import { isPath } from "../../../../../utility/Functions";
import React from "react";
import "./Table.css";
import EmployeeLeaveList from "./EmployeeLeaveList";
import EmployeeLeaveBalance from "./EmployeeLeaveBalance";

export default function EmployeeLeave(props) {

    const display = isPath("/pages/employee/leave/");
    
    return (
        display &&
        <div className="EmployeeLeave">
            <EmployeeLeaveList />
            <hr />
            <EmployeeLeaveBalance />
        </div>
    )
}