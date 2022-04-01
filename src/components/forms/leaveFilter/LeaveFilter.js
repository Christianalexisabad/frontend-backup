import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHost } from "../../../utility/APIService";
import { isPath } from "../../../utility/Functions";
import CancelButton from "../cancelButton/CancelButton";
import './LeaveFilter.css';

const LeaveFilter = (props) => {

    let {  onChange, onClear, data } = props;

    let { department, employee, status } = data;

    department = parseInt(department);
    employee = parseInt(employee);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        
        if (!startDate && !endDate) {
            if (data.startDate && data.startDate <= data.endDate) {
                setStartDate(data.startDate);
            } 
        }

        if (!startDate || !endDate) {
            if (data.endDate && data.endDate >= data.startDate) {
                setEndDate(data.endDate);
            }   
        }
    }, [ data, endDate, startDate ]);

    const [Departments, setDepartments] = useState([]);
    const [Employees, setEmployees] = useState([]);

    const Statuses = [
        { id: 0, value: "Pending"},
        { id: 1, value: "Approved"},
        { id: 2, value: "Declined"},
    ];
    
    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/")
        const { data } = await response.data;
        setDepartments(data);
    }

    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/order=id/")
        const { data } = await response.data;
        setEmployees(data);
    }

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, [])

    const isEmployee = isPath("/pages/employee/leave/");

    const list = [
        { id: "department", title: "Select Department", data: Departments, value: department, display: isEmployee },
        { id: "employee", title: "Select Employee", data: Employees, value: employee, display: isEmployee },
        { id: "status", title: "Select Status", data: Statuses, value: status, display: true },
    ]

    return (
        <div className="LeaveFilter">
            <ul className="list p-0 m-0">
                <li className="listItem">
                    <label>Filters: </label>
                </li>
                {list.map((item, index) => {
                    return (
                        item.display &&
                        <li key={index} className="listItem">
                            <select id={item.id} onChange={onChange} value={item.value ? item.value : ''}>
                                <option value="">{item.title}</option>
                                {item.data.map((item, index) => {
                                    const values = Object.values(item);
                                    return <option key={index} value={values[0]}>{values[1]}</option>
                                })}
                            </select>
                        </li>
                    )
                })}     
                <li>
                    <label>From: </label>
                    <input id="startDate" type="date" value={startDate} onChange={onChange} />
                    <label> <b>-</b> </label>
                    <input id="endDate" type="date" value={endDate} onChange={onChange} />
                </li>
                <li>
                    <CancelButton
                        text="Clear Filter"
                        onClick={onClear}
                    />
                </li>
            </ul>
        </div>
    )
}

export default LeaveFilter;