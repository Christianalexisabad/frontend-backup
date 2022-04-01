import { getHost } from "../../../../../../utility/APIService";
import Announcement from '../../../../announcement/Announcement';
import { isPath } from '../../../../../../utility/Functions';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryDashboard.css';
import { Link } from "react-router-dom";
import { getSessionID } from "../../../../../../utility/Session";
import YearlyItemCount from "./components/YearlyItemCount/YearlyItemCount";

const InventoryDashboard = () => {

    const display = isPath("/pages/inventory%20dashboard/");

    const [data, setData] = useState({
        item_count: 0,
        office_supplies: 0,
        office_supply_requests: 0,
        equipment_requests: 0,
        transfers: 0,
    });

    const fetchData = async () => {
        const response = await axios.get(getHost() + "/api/dashboard/hr/")
        const { data } = await response.data;
        setData(data);
    }

    useEffect(() =>{
        fetchData();
    }, []);

    const renderCard =() => {

        const { item_count, office_supplies, equipments,  office_supply_requests, equipment_requests, transfers } = data;

        const hrData = [
            { title: "Item Count", path: "/pages/inventory/office supply/", icon: "fa fa-cubes", value: item_count, color: "rgb(20,20,120)" },
            { title: "Office Supplies", path: "/pages/inventory/office supply/",  icon: "fa fa-cube", value: office_supplies, color: "rgb(20,200,20)" },
            { title: "Equipments", path: "/pages/inventory/equipment/", icon: "fas fa-tools", value: equipments, color: "rgb(20,120,20)"},
            { title: "Office Supply Requests", path: "/pages/inventory/office supply/",  icon: "fas fa-file-alt", value: office_supply_requests , color: "orange" },
            { title: "Equipment Requests", path: "/pages/inventory/equipment/",  icon: "fas fa-file-alt", value: equipment_requests, color: "orange" },
            { title: "Transfers", path: "",  icon: "fa fa-exchange", value: transfers, color: "grey" },
        ]

        return hrData.map((item, index) => {

            const { value, path ,title, icon, color } = item;

            return (
                <div key={index}  className="card">
                    <ul>
                        <li>
                            <p className="value">{!value ? 0 : value}</p>
                            <p className="label">{title} 
                                <span> {path && <Link to={path + getSessionID()}>view</Link>} </span>
                            </p>
                        </li>
                        <li>
                            <i className={icon} style={{ color: color}}></i>
                        </li>
                    </ul>
                </div>
            )
        })
    }

    return (
        display &&
        <div className="InventoryDashboard">
            <div className="row">
                <div className="col-lg-8 p-0">
                    <div className="row">
                        <div className="col-lg-12">
                            {renderCard()}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 p-0">
                    <Announcement/>
              </div>
            </div>
            <div className="row">
                <div className="col-lg-4">
                </div>
                <div className="col-lg-4">
                </div>
                <div className="col-lg-4">
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 p-3">
                    <YearlyItemCount />
                </div>
                <div className="col-lg-6 p-3">
                </div>
            </div>
        </div> 
    )
}

export default InventoryDashboard;