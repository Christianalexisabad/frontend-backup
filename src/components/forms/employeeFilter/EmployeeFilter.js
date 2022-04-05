import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHost } from "../../../utility/APIService";
import './EmployeeFilter.css';

const EmployeeFilter = (props) => {

    let {  onChange, data } = props;

    let { 
        department, 
        employee_status,
        employee_type,
        startDate,
        endDate,
        sex,
    } = data;

    const [Departments, setDepartments] = useState([]);

    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/")
        const { data } = await response.data;
        setDepartments(data);
    }

    const [Types, setTypes] = useState([]);

    const fetchTypes = async () => {
        const response = await axios.get(getHost() + "/api/employee-types/")
        const { data } = await response.data;   
        setTypes(data);
    }

    const [Statuses, setStatuses] = useState([]);

    const fetchStatuses = async () => {
        const response = await axios.get(getHost() + "/api/employee-statuses/")
        const { data } = await response.data;   
        setStatuses(data);
    }

    const [Sexes, setSexes] = useState([]);
    
    const fetchSexes = async () => {
        const response = await axios.get(getHost() + "/api/sexes/")
        const { data } = await response.data;
        setSexes(data);
    }

    useEffect(() => {
        fetchDepartments();
        fetchTypes();
        fetchStatuses();
        fetchSexes();
    }, [])

    return (
        <div className="EmployeeFilter">
            <ul className="list">
                <li className="listItem">
                    <select id="department" onChange={onChange} value={department}>
                        <option value="">Select Department</option>
                        {Departments.map((item, index) => {
                            const values = Object.values(item);
                            return <option key={index} value={values[0]}>{values[1]}</option>
                        })}
                    </select>
                </li>
                <li className="listItem">
                    <select id="employee_status" onChange={onChange} value={employee_status}>
                        <option value="">Select Status</option>
                        {Statuses.map((item, index) => {
                            const values = Object.values(item);
                            return <option key={index} value={values[0]}>{values[1]}</option>
                        })}
                    </select>
                </li>
                <li className="listItem">
                    <select id="employee_type" onChange={onChange} value={employee_type}>
                        <option value="">Select Type</option>
                        {Types.map((item, index) => {
                            const values = Object.values(item);
                            return <option key={index} value={values[0]}>{values[1]}</option>
                        })}
                    </select>
                </li>
                <li className="listItem">
                    <select id="sex" onChange={onChange} value={sex}>
                            <option value="">Select Sex</option>
                            {Sexes.map((item, index) => {
                                const values = Object.values(item);
                                return <option key={index} value={values[0]}>{values[1]}</option>
                            })}
                    </select>
                </li>
                <li className="listItem">
                    <label>From: </label>
                    <input id="startDate" type="date" value={startDate} onChange={onChange} />
                    <b> - </b>
                    <input id="endDate" type="date" value={endDate} onChange={onChange} />
                </li>
            </ul>
            
            <div className="row">
                <div className="col-lg-12">
                    
                    
                   
                    
                </div>
            </div> 
        </div>
    )
}

export default EmployeeFilter;