import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../../../forms/button/Button";
import { getHost } from "../../../../../../../../../utility/APIService";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./Children.css";
import { getSessionID } from "../../../../../../../../../utility/Session";
import { ADD_CHILD, EDIT_CHILD } from "../../../../../../../../../utility/Route";
import EditButton from "../../../../../../../../forms/editButton/EditButton";

export default function Children(props){

    const HOST = getHost();
    const { employee } = useParams();
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        const response = await axios.get(HOST + "/api/childrens/"+ employee +"/");
        const { data } = await response.data;
        setData(data);
    }, [ HOST, employee ])

    useEffect(() => {
        fetchData();
    }, [ fetchData ])  

    function renderTbody() {
        try {
            return data.map((item, index) => {

                console.log(item)

                return (
                    <tr key={item.id}>
                        <td>{index+=1}</td>
                        <td>{item.full_name}</td>
                        <td>{item.birthdate}</td>
                        <td className="text-center">
                            <EditButton to={EDIT_CHILD + item.id +"/"} />
                        </td>
                    </tr>
                )
            })
        } catch (error) {
                
        }
    }

    return (
        <div className="Children">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Children </span>    
                        <span style={{ fontSize: "15px" }}><Link to={ADD_CHILD + getSessionID()}>Add New</Link></span>
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
                                <th>Birthdate</th>
                                <th className="text-center">Action</th>
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