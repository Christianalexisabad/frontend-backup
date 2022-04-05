import { isPath } from "../../../../../utility/Functions";
import EquipmentList from "./EquipmentList";
import EquipmentRequest from "./EquipmentRequest";
import EquipmentTransfer from "./EquipmentTransfer";
import React from "react";
import "./Table.css";

export default function Equipment() {

    const display = isPath("/pages/inventory/equipment/");

     return (
        display &&
        <div>
            <EquipmentList />
            <hr />
            <EquipmentRequest />
            <hr />
            <EquipmentTransfer />
        </div>
    )
}