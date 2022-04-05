import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { useParams } from "react-router-dom";
import "./Status.css";
import { getData, getEmployeeStatus } from "../../../../../../../utility/Functions";
import ChangeEmployeeStatus from "./changeEmployeeStatus/ChangeEmployeeStatus";

export default function Status(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);
    const [changeStatus, setChangeStatus] = useState(false);
    const [employee_status, setEmployeeStatus] = useState("");
    const [EmployeeStatuses, setEmployeeStatuses] = useState([]);

    const fetchEmployeeStatuses = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employee-statuses/");
        const { data } = await response.data;
        setEmployeeStatuses(data);
    }, [ HOST ])
    
    const fetchEmployeeStatus = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employees/get-employee-status/"+ employee +"/");
        const { data } = await response.data;
        setEmployeeStatus(data);
    }, [ HOST, employee ])

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employee-status-histories/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {
        fetchEmployeeStatus();
        fetchEmployeeStatuses();
        fetchData();
    }, [ fetchData, fetchEmployeeStatus, fetchEmployeeStatuses ])  

    function renderTableHeader() {

        const header = [
            { id: "id", value: "no" },
            { id: "employee_status", value: "status" },
            { id: "reason", value: "reason" },
            { id: "comment", value: "comment" },
            { id: "effective_date", value: "effective date" },
        ]
        return (
            <thead> 
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{ item.value }</span>
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

    function renderTbody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{getEmployeeStatus(getData(item.status, "name", EmployeeStatuses))}</td>
                            <td>{item.reason}</td>
                            <td>{item.comment}</td>
                            <td>{item.effective_date}</td>
                        </tr>
                    )
                }) : <tr>
                    <td colSpan={10} className="text-center text-secondary"> <span>No data to show</span> </td>
                </tr> }
            </tbody>
        )
    }

    if (changeStatus) {
        return <ChangeEmployeeStatus employee={employee} status={employee_status} onClose={()=> setChangeStatus(false)} />
    }

    return (
        <div className="Status">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Status </span>
                        <Button icon="fa fa-refresh" onClick={()=>{
                            fetchEmployeeStatus();
                            fetchData();
                        }}/>
                    </h1>
                    <span className="text-secondary">Current status: {getEmployeeStatus(getData(employee_status, "name", EmployeeStatuses))} </span>
                    <Button icon="fa fa-edit" onClick={()=> setChangeStatus(true)}/>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-lg-12" style={{ maxHeight: window.innerHeight -(window.innerHeight * 0.4) , overflowY: 'auto' }}>
                    <h4 className="text-secondary sub-title">Status History</h4>
                    <table className="table table-hover">
                        {renderTableHeader()}
                        {renderTbody()}
                    </table>
                </div>        
            </div>
        </div>
    )   
}