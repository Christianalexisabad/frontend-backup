import DialogBox from "../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../utility/APIService";
import React, { useState, useEffect, useCallback } from "react";
import Input from "../../../../../forms/input/Input";
import axios from "axios";
import Button from "../../../../../forms/button/Button";
import Select from "../../../../../forms/select/Select";
import { getEmployeeID } from "../../../../../../utility/Session";
import { useParams } from "react-router-dom";

export default function WorkInfo(){

    const { tab } = useParams();
    const display = tab === "work information" ? true : false;

    const HOST = getHost();
    const employee = getEmployeeID();
    const [isSuccess, setSuccess] = useState(false);
    const [isEditable, setEditable] = useState(false);
    const [data, setData] = useState({});
    const [message, setMessage] = useState("");

    const [Positions, setPositions] = useState([]);
    const [Departments, setDepartments] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Salaries, setSalaries] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employees/" + employee + "/work-info/");
        let { data } = await response.data;
       
        const {position } = data;
        const { department } = position;    
        const { department_head_id } = department;

        data['position'] = position.id;
        data['positionTitle'] = position.title;
        data['payGrade'] = position.salary.pay_grade;
        data['department'] = department.id;
        data['departmentHead'] = department_head_id === 0 ? null : department_head_id;
        data['salary'] = position.salary.id;

        setData(data);
    
    }, [ HOST, employee ])

    const {
        department, 
        position, 
        departmentHead,
        start_date, 
        end_date,
        positionTitle,
        payGrade,
        salary,
    } = data;

    const fetchEmployees = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/employees/");
        const { data } = await response.data;
        setEmployees(data);
    }, [])

    const fetchPositions = useCallback(async () => {
        const endpoint = getHost() + "/api/positions/department=" + department + "/"
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setPositions(data);
    }, [ department ])

    const fetchDepartments = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/departments/");
        const { data } = await response.data;
        setDepartments(data);
    }, [])

    const fetchSalaries = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/salaries/");
        const { data } = await response.data;
        setSalaries(data);
    }, [])

    useEffect(() => {
        if (display) {
            fetchDepartments();
            fetchSalaries();
            fetchEmployees();
            fetchPositions();
            fetchData();
        }
    }, [ display, fetchData, fetchPositions, fetchDepartments, fetchSalaries, fetchEmployees ])

    const handleInputChange = (event) => {
        event.preventDefault();
        setData({ ...data, [event.target.id]: event.target.value });
    }

    const handleRefresh = (event) => {
        event.preventDefault();
        fetchData();
        setMessage("");
        setSuccess(false);
        setEditable(false);
    }

    return (
        <div className="WorkInformation">
            <div className="row">
                <div className="col-lg-12">
                    <form>
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-secondary">
                                    <span>Work Information </span>
                                    <Button 
                                        icon="fa fa-refresh" 
                                        onClick={handleRefresh}
                                    />
                                </h1>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-lg-12">
                            <DialogBox
                                isSuccess={isSuccess}
                                message={message}
                                onClose={()=> setMessage("")}
                            />
                            <Select
                                id="department"
                                type="text" 
                                label="department" 
                                value={department}
                                options={Departments}
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            />
                            <Select
                                label="department head" 
                                value={departmentHead}
                                options={Employees}
                                disabled={true}
                            />
                            {isEditable ? 
                                <Select
                                    id="position"
                                    type="text" 
                                    label="position" 
                                    value={position}
                                    options={Positions}
                                    disabled={!isEditable}
                                    onChange={handleInputChange}
                                /> : 
                                <Input
                                    type="text" 
                                    label="position" 
                                    disabled={true}
                                    value={positionTitle}
                                />
                            }
                            <Input 
                                id="start_date"
                                type="date" 
                                label="start date" 
                                value={start_date} 
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            />
                            {end_date && 
                                <Input 
                                    id="end_date"
                                    type="date" 
                                    label="end date" 
                                    value={end_date} 
                                    disabled={!isEditable}
                                    onChange={handleInputChange}
                                />
                            }
                            {isEditable ? 
                                <Select
                                    label="salary" 
                                    value={salary} 
                                    options={Salaries}
                                    disabled={true}
                                /> : 
                                <Input
                                    label="salary" 
                                    value={payGrade} 
                                    disabled={true}
                                />
                            }
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )   
}