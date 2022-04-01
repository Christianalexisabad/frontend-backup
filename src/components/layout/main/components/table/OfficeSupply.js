import { isPath } from "../../../../../utility/Functions";
import "./Table.css";
import React from "react";
import OfficeSupplyStockHistory from "./OfficeSupplyStockHistory";
import OfficeSupplyRequest from "./OfficeSupplyRequest";
import OfficeSupplyTransfer from "./OfficeSupplyTransfer";
import OfficeSupplyStock from "./OfficeSuppyStock";
import { hasPermission } from "../../../../../utility/Permission";

export default function OfficeSupply() {

    const display = isPath("/pages/inventory/office%20supply/");

     return (
        display &&
        <div>
            <OfficeSupplyStock />
            <hr />
            <OfficeSupplyRequest />
            {hasPermission("can_view_stock_history") && <span>
                <hr />
                <OfficeSupplyStockHistory />
            </span> }
            <OfficeSupplyTransfer />
        </div>
    )
}