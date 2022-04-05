import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { useParams } from "react-router-dom";
import "./Attendance.css";

export default function Attendance(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/attendances/employee="+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {
        fetchData();
    }, [ fetchData ])  

    function renderTableHeader() {

        const header = [
            { id: "id", name: "no" },
            { id: "am_in", name: "AM In" },
            { id: "am_out", name: "AM Out" },
            { id: "am_remarks", name: "status" },
            { id: "pm_in", name: "PM In" },
            { id: "pm_out", name: "PM Out" },
            { id: "pm_remarks", name: "status" },
            { id: "date", name: "Date" },
        ]
        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{ item.name }</span>
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                { data.length > 0 ? 
                    data.map((item, index) => {

                    const { date, am_in, am_out, am_remarks, pm_in, pm_out, pm_remarks } = item;

                    return (
                            <tr key={index}>
                                <td>{index+=1}</td>
                                <td>{date}</td>
                                <td>{am_in}</td>
                                <td>{am_out}</td>
                                <td>{am_remarks}</td>
                                <td>{pm_in}</td>
                                <td>{pm_out}</td>
                                <td>{pm_remarks}</td>
                            </tr>
                        )
                    })
                    : 
                    <tr>
                        <td>
                            No data to show.   
                        </td>
                    </tr>
                }
            </tbody>
        )
    }

    return (
        <div className="Attendance">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Attendance </span>
                        <Button icon="fa fa-refresh" onClick={()=>{
                            fetchData();
                        }}/>
                    </h1>
                    <span className="text-secondary">Status: </span>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-lg-12">
                    <h4 className="text-secondary sub-title">Attendance History</h4>
                    <table className="table table-hover">
                        {renderTableHeader()}
                        {renderTableBody()}
                    </table>
                </div>        
            </div>
        </div>
    )   
}