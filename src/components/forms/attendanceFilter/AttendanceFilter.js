import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHost } from "../../../utility/APIService";
import { isPath } from "../../../utility/Functions";
import CancelButton from "../cancelButton/CancelButton";
import './AttendanceFilter.css';

const AttendanceFilter = (props) => {

    const {  onChange, onClear, data } = props;

    let { department, employee, status, startDate, endDate } = data;

    const [Departments, setDepartments] = useState([]);
    const [Employees, setEmployees] = useState([]);

    const Statuses = [
        { id: 1, value: "Present"},
        { id: 2, value: "Late"},
        { id: 4, value: "Absent"},
        { id: 5, value: "Undertime"},
    ];

    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/")
        const { data } = await response.data;
        setDepartments(data);
    }

    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/")
        const { data } = await response.data;
        setEmployees(data);
    }

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, [])

    const isEmployee = isPath("/pages/employee/attendance/");
    
    const list = [
        { id: "department", title: "Select Department", data: Departments, value: department, display: isEmployee },
        { id: "employee", title: "Select Employee", data: Employees, value: employee, display: isEmployee },
        { id: "status", title: "Select Status", data: Statuses, value: status, display: true },
    ]

    return (
        <div className="AttendanceFilter">
            <ul className="list">
                {list.map((item, index) => {
                    return (
                        item.display &&
                        <li key={index} className="listItem">
                            <select id={item.id} onChange={onChange} value={item.value}>
                                <option value="">{item.title}</option>
                                {item.data.map((item, index) => {
                                    const values = Object.values(item);
                                    return <option key={index} value={ values[0] }>{ values[1] }</option>
                                })}
                            </select>
                        </li>
                    )
                })}
                <li className="listItem">
                    <label htmlFor="from">From: </label>
                    <input id="startDate" type="date" value={startDate} onChange={onChange} />
                    <label htmlFor="from"> to: </label>
                    <input id="endDate" type="date" value={endDate} onChange={onChange} />
                </li>
                <li>
                    <CancelButton
                        text="Clear Filter"
                        onClick={ onClear }
                    />
                </li>
            </ul>
        </div>
    )
}

export default AttendanceFilter;