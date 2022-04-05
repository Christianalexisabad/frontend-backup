import axios from "axios";
import React, { useEffect, useState } from "react";
import { getHost } from "../../../utility/APIService";
import { isPath } from "../../../utility/Functions";
import './BenefitFilter.css';

const BenefitFilter = (props) => {

    let {  onChange, data } = props;
    let { department, employee } = data;

    const [Departments, setDepartments] = useState([]);
    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/")
        const { data } = await response.data;
        setDepartments(data);
    }

    const [Employees, setEmployees] = useState([]);
    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/")
        const { data } = await response.data;
        setEmployees(data);
    }

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, [])

    const isEmployee = isPath("/pages/employee/benefits/");

    const styles = {
        listItem: { 
            display: isEmployee ? 'inline-block' : 'none' 
        }
    }

    return (
        <div className="BenefitFilter">
            <ul className="list p-0 m-0">
                <li className="listItem">
                    <label>Filters: </label>
                </li>
                <li className="listItem" style={styles.listItem}>
                    <select id="department" onChange={onChange} value={department ? department : ""}>
                        <option value="">Select Department</option>
                        {Departments.map((item, index) => {
                            const values = Object.values(item);
                            return <option key={index} value={values ? values[0] : ""}>{values[1]}</option>
                        })}
                    </select>
                </li>      
                <li className="listItem" style={styles.listItem}>
                    <select id="employee" onChange={onChange} value={employee ? employee : ""}>
                        <option value="">Select employee</option>
                        {Employees.map((item, index) => {
                            const values = Object.values(item);
                            return <option key={index} value={values[0]}>{values[1]}</option>
                        })}
                    </select>
                </li>
            </ul>
        </div>
    )
}

export default BenefitFilter;