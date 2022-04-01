import React, { useCallback, useEffect, useState } from "react";
import Button from "../../../../../../../../forms/button/Button";
import { getHost } from "../../../../../../../../../utility/APIService";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Children.css";
import { getEmployeeID, getRole } from "../../../../../../../../../utility/Session";
import { EDIT_CHILD } from "../../../../../../../../../utility/Route";
import EditButton from "../../../../../../../../forms/editButton/EditButton";
import { hasPermission } from "../../../../../../../../../utility/Permission";
import AddChildren from "./components/AddChildren";

export default function Children(props){

    const HOST = getHost();
    const employee = getEmployeeID();
    const [data, setData] = useState([]);
    const [Add, setAdd] = useState(false);
    const ROLE = getRole();

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
                        {ROLE === 4 && <td className="text-center">
                            <EditButton to={EDIT_CHILD + item.id +"/"} />
                        </td>}
                    </tr>
                )
            })
        } catch (error) {
                
        }
    }

    return (
        <div className="Children">
            {Add && <AddChildren onCancel={()=> setAdd(false)} />}
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="text-secondary">
                        <span>Children </span>    
                        {hasPermission("can_edit_employee") && <span style={{ fontSize: "15px" }}>
                            <Link onClick={()=> setAdd(true)}>Add Member</Link>
                        </span>}
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