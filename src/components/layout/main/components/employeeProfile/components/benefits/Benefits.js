import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { useParams } from "react-router-dom";
import "./Benefits.css";
import { getData } from "../../../../../../../utility/Functions";

export default function Benefits(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/benefits/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    const [Companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        let response = await axios.get(getHost() + "/api/government-companies/");
        let { data } = await response.data;
        setCompanies(data);
    }

    useEffect(() => {
        fetchCompanies();
        fetchData();
    }, [ fetchData ])  

    const header = [
        { id: "id", value: "no" },
        { id: "government_company", value: "company" },
        { id: "employer_share", value: "employer share" },
        { id: "employer_share_percent", value: "employer share % " },
        { id: "employee_share", value: "employee share" },
        { id: "employee_share_percent", value: "employee share %" },
        { id: "total", value: "total" },
        { id: "total_percent", value: "total %" },
        { id: "contribution_deadline", value: "contribution deadline"},
    ]

    function renderTableHeader() {

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

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    return (
                        <tr key={item.id}>
                            <td>{index+=1}</td>
                            <td>{getData(item.government_company, "name", Companies)}</td>
                            <td>{item.employer_share}</td>
                            <td>{item.employer_share_percent}</td>
                            <td>{item.employee_share}</td>
                            <td>{item.employee_share_percent}</td>
                            <td>{item.total}</td>
                            <td>{item.total_percent}</td>
                            <td>{item.contribution_deadline}</td>
                        </tr>
                    )
                }) : <tr> <td colspan={header.length} className="text-secondary text-center">No data to show</td> </tr> }
            </tbody>
        )
    }


    return (
        <div className="Benefits">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Benefits </span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <table className="table" style={{ width: '100%'}}>
                        {renderTableHeader()}
                        {renderTableBody()}
                    </table>
                </div>        
            </div>
        </div>
    )   
}