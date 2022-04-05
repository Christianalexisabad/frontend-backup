import DialogBox from "../../../../../forms/dialogBox/DialogBox";
import { getHost } from "../../../../../../utility/APIService";
import React, { useState, useEffect, useCallback } from "react";
import Input from "../../../../../forms/input/Input";
import axios from "axios";
import Button from "../../../../../forms/button/Button";
import CancelButton from "../../../../../forms/cancelButton/CancelButton";
import SubmitButton from "../../../../../forms/submitButton/SubmitButton";
import { useParams } from "react-router-dom";
import Select from "../../../../../forms/select/Select";
import { Name } from "../../../../../../utility/Functions";

const initialData = {
    id: null,
    department: null, 
    position: null, 
    departmentHead: "",
    start_date: "", 
    end_date: "",
    positionTitle: "",
    payGrade: "",
    salary: null
}

export default function WorkInfo(props){

    const { employee, tab } = useParams();
    const display = tab === "work information" ? true : false;

    const HOST = getHost();
    const [isSuccess, setSuccess] = useState(false);
    const [isEditable, setEditable] = useState(false);
    const [data, setData] = useState(initialData);
    const [message, setMessage] = useState("");

    const [Positions, setPositions] = useState([]);
    const [Departments, setDepartments] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Salaries, setSalaries] = useState([]);

    const fetchData = useCallback(async () => {
        
        const response = await axios.get(HOST + "/api/employees/" + employee + "/work-info/");
        const { data } = await response.data;
        
        const { position } = data;
        const { department } = position;    
        const { department_head_id } = department;

        let newData = data;

        newData['position'] = position.id;
        newData['positionTitle'] = position.title;
        newData['payGrade'] = position.salary.pay_grade;
        newData['department'] = department.id;
        newData['departmentHead'] = department_head_id;
        newData['salary'] = position.salary.id;
       
        setData(newData);

    }, [ HOST, employee ])

    const {
        id,
        department, 
        position, 
        departmentHead,
        start_date, 
        end_date,
        positionTitle,
        payGrade,
        salary,
    } = data;

    const fetchPositions = useCallback(async () => {
        const response = await axios.get(HOST + "/api/positions/department=" + department + "/")
        const { data } = await response.data;
        setPositions(data);
    }, [ HOST, department ])

    const fetchDepartments = useCallback(async () => {
        const response = await axios.get(HOST + "/api/departments/");
        const { data } = await response.data;
        setDepartments(data);
    }, [ HOST ])

    const fetchEmployees = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employees/");
        const { data } = await response.data;

        let employees = [];

        for (const item of data) {
            employees.push({

                id: item.id,
                name: Name(item),
            })
        }

        setEmployees(data);
    }, [ HOST ])

    const fetchSalaries = useCallback(async () => {
        const response = await axios.get(HOST + "/api/salaries/");
        const { data } = await response.data;
        setSalaries(data);
    }, [ HOST ])

    // useEffect(() => {
    //     if (department) {
    //         setData({ 
    //             ...data, 
    //             departmentHead: getData(parseInt(department), "department_head_id", Departments) 
    //         });
    //     } 
    // }, [ department, Departments, data ]);

    useEffect(() => {

        if (display && !isEditable){
            fetchPositions();
            fetchSalaries();
            fetchEmployees();
            fetchDepartments();
            fetchData();
        }

    }, [ isEditable, display, fetchData, fetchSalaries, fetchEmployees, fetchPositions, fetchDepartments ])


    // useEffect(() => {

    //     // if (position) {
    //     //     setData({ 
    //     //         ...data, 
    //     //         salary: getData(parseInt(position), "salary", Positions).id,
    //     //     })     
    //     // }
        

    // }, [ position, Positions, data ])


    const handleInputChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });
    }

    function setDialogMessage(message, status) {
        status = status ? status : false;
        setMessage(message);
        setSuccess(status);
        return status;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSuccess) {
            setMessage("");
            setSuccess(false);
        } else {
            if (!position) {
                setDialogMessage("Please select a position.")
            }     
            axios.patch(HOST + "/api/employees/update/" + id + "/", {
                position: position,
                start_date: start_date,
                end_date: end_date
            })
            .then(res => {
                setDialogMessage(res.data.message, true);
                setEditable(false);
            }).catch(err => {
                setDialogMessage(err.response.data.message);
            })
        }
    }

    const handleRefresh = (e) => {
        e.preventDefault();
        fetchData();
        setMessage("");
        setSuccess(false);
        setEditable(false);
    }

    return (
        display &&
        <div className="WorkInformation">
            <div className="row">
                <div className="col-lg-12">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-secondary">
                                    <span>Work Information </span>
                                    <Button icon="fa fa-refresh" onClick={handleRefresh}/>
                                </h1>
                                {!isEditable && <Button 
                                    text="edit"
                                    onClick={() => setEditable(true)} 
                                    permission="can_edit_employee"
                                />}
                                <CancelButton 
                                    text="cancel" 
                                    display={isEditable}
                                    onClick={() => setEditable(false)} 
                                />
                                <SubmitButton 
                                    text="Save" 
                                    display={isEditable}
                                />
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
                            {isEditable ? <Select
                                id="position"
                                type="text" 
                                label="position" 
                                value={position ? parseInt(position) : 0}
                                // refresh={()=> fetchPositions(department)}
                                options={Positions}
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            /> : <Input
                                type="text" 
                                label="position" 
                                disabled={true}
                                value={positionTitle}
                            />}
                            <Input 
                                id="start_date"
                                type="date" 
                                label="start date" 
                                value={start_date} 
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            />
                            {end_date && <Input 
                                id="end_date"
                                type="date" 
                                label="end date" 
                                value={end_date} 
                                disabled={!isEditable}
                                onChange={handleInputChange}
                            />}
                            {isEditable ? <Select
                                label="salary" 
                                value={salary} 
                                options={Salaries}
                                disabled={true}
                            /> : <Input
                                label="salary" 
                                value={payGrade} 
                                disabled={true}
                            />}
                        </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">

                </div>
            </div>
        </div>
    )   
}