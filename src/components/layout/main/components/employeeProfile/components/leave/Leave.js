import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { useParams } from "react-router-dom";
import "./Leave.css";

export default function Leave(props){

    const HOST = getHost();
    const { employee, tab } = useParams();
    const display = tab === "leave" ? true : false;

    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employee-leaves/employee="+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {
        fetchData();
    }, [ fetchData ])  

    function renderTableHeader() {

        const header = [
            { id: "id", value: "No" },
            { id: "leave_type", value: "Leave Type" },
            { id: "other_details", value: "Other Details" },
            { id: "number_of_working_days", value: "Working Days" },
            { id: "start_date", value: "Start Date" },
            { id: "end_date", value: "End Date" },
            { id: "supervisor_remarks", value: "Supervisor Remarks" },
            { id: "supervisor_approval_date", value: "Date" },
            { id: "hr_remarks", value: "HR Remarks" },
            { id: "hr_approval_date", value: "Date" },
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
                {data.length > 0 ? 
                    data.map((item, index) => {
                        return (
                            <tr key={index}>
                            </tr>
                        )
                    }) : 
                    <tr>
                        <td colSpan={10} className="text-center text-secondary"> 
                            No data to show
                        </td>
                    </tr> 
                }
            </tbody>
        )
    }

    return (
        display &&
        <div className="Leave">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        Leave
                        <Button 
                            icon="fa fa-refresh" 
                            onClick={()=> fetchData() }
                        />
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <table className="table" style={{ width: '100%'}}>
                        {renderTableHeader()}
                        {renderTbody()}
                    </table>
                </div>        
            </div>
        </div>
    )   
}