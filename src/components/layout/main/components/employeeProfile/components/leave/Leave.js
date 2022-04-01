import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { useParams } from "react-router-dom";
import "./Leave.css";

export default function Leave(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/leaves/get/employee="+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {
        fetchData();
    }, [ fetchData ])  

    function renderTableHeader() {

        const header = [
            { id: "id", value: "no" },
            { id: "leave_type", value: "leave type" },
            { id: "other_details", value: "other details" },
            { id: "number_of_working_days", value: "working days" },
            { id: "start_date", value: "start date" },
            { id: "end_date", value: "end date" },
            { id: "supervisor_remarks", value: "supervisor remarks" },
            { id: "supervisor_approval_date", value: "date" },
            { id: "hr_remarks", value: "HR remarks" },
            { id: "hr_approval_date", value: "date" },
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
                        <tr key={item.id}>
                        </tr>
                    )
                }) : <tr>
                    <td colSpan={10} className="text-center text-secondary"> <span>No data to show</span> </td>
                </tr> }
            </tbody>
        )
    }

    return (
        <div className="Leave">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Leave </span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
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