import { isPath } from "../../../../../utility/Functions";
import React, { useState } from "react";
import OfficeSupplyTypes from "../table/OfficeSupplyTypes";
import OfficeSupplyArticles from "../table/OfficeSupplyArticles";
import EquipmentTypes from "../table/EquipmentTypes";
import EquipmentArticles from "../table/EquipmentArticles";

export default function InventorySettings(props) {

    const display = isPath("/pages/inventory%20settings/");
    const [isActive, setActive] = useState({});

    const data = [
        { 
            id: 'list1', 
            title: 'General',
            content: <div>
                <OfficeSupplyArticles />
            </div>
        },
        { 
            id: 'list2', 
            title: 'Office Supply Settings',
            content: <div>
                <OfficeSupplyTypes />
                <hr />
                <OfficeSupplyArticles />
            </div>
        },
        { 
            id: 'list3', 
            title: 'Equipment Settings',
            content: <div>
                <EquipmentTypes />
                <hr />
                <EquipmentArticles />
            </div>
        },
    ]

 
     return (
        display &&
        <div className="Settings">
            <ul className="list m-0 p-0">
                {data.map((item, index) => {

                    const active = isActive[item.id];

                    return (
                        <li key={index} className="listItem" >
                            <p 
                                onClick={()=> setActive({ ...isActive, [item.id]: active ? false : true })}
                                style={{ fontWeight: active ? 'bold' : 'normal', borderBottom: active ? '1px solid rgb(230, 230, 230)' : 'none' }}>
                                <span>{item.title}</span>
                                <i className={"item-toggle " +(active ? "fa fa-angle-down" : "fa fa-angle-left")}></i>
                            </p> 
                            {active && item.content}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}