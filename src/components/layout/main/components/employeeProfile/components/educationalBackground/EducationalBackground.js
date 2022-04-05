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
    const { employee, tab } = useParams();
    const display = tab === "educational background" ? true : false;

    const header = [
        "No",
        "Name",
        "Level",
        "School name",
        "Basic ed/degree/course",
        "From",
        "To",
        "Highest level units earned",
        "Date graduated",
    ];

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
                {data.length > 0 ? 
                    data.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.level}</td>
                                <td>{item.school_name}</td>
                                <td>{item.basic_ed_deg_course}</td>
                                <td>{item.year_from}</td>
                                <td>{item.year_to}</td>
                                <td>{item.highest_level_units_earned}</td>
                            </tr>
                        )
                    }) 
                    : 
                    <tr>
                        <td colSpan={header.length} className="text-center text-secondary"> 
                            No data to show
                        </td>
                    </tr> 
                }
            </tbody>
        )       
    }

    return (
        display &&
        <div className="EducationalBackground">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Educational Background </span>
                        <Button 
                            icon="fa fa-refresh" 
                            onClick={()=>fetchData()}
                        />
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <table className="table" style={{ width: '100%'}}>
                        <thead>
                            <tr>
                                {header.map((item, index) => {
                                    return <th key={index}>{item}</th>;
                                })}
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