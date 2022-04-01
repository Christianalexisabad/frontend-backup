import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../forms/button/Button";
import axios from "axios";
import { getHost } from "../../../../../../../utility/APIService";
import { Link, useParams } from "react-router-dom";
import "./EducationalBackground.css";
import { ADD_EDUCATIONAL_BACKGROUND } from "../../../../../../../utility/Route";
import { getSessionID } from "../../../../../../../utility/Session";

export default function EducationalBackground(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/educational-backgrounds/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])
    
    useEffect(() => {
        fetchData();
    }, [ fetchData ])  

    function renderTbody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.level}</td>
                            <td>{item.school_name}</td>
                            <td>{item.basic_ed_deg_course}</td>
                            <td>{item.year_from}</td>
                            <td>{item.year_to}</td>
                            <td>{item.highest_level_units_earned}</td>
                        </tr>
                    )
                }) : <tr>
                    <td colSpan={10} className="text-center text-secondary"> <span>No data to show</span> </td>
                </tr> }
            </tbody>
        )       
    }

    return (
        <div className="EducationalBackground">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Educational Background </span>
                        <span style={{ fontSize: "15px" }}><Link to={ADD_EDUCATIONAL_BACKGROUND + getSessionID()}>Add New</Link></span>
                        <Button icon="fa fa-refresh" onClick={()=>fetchData()}/>
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <table className="table" style={{ width: '100%'}}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Level</th>
                                <th>School name</th>
                                <th>Basic ed/degree/course</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Highest level units earned</th>
                                <th>Date graduated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTbody()}
                        </tbody>
                    </table>
                </div>        
            </div>
        </div>
    )   
}