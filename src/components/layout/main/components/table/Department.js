import { pathContains } from "../../../../../utility/Functions";
import React from "react";
import { DEPARTMENTS } from "../../../../../utility/Route";
import EditDepartment from "../../../edit/EditDepartment";
import AddDepartment from "../../../createForm/AddDepartment";
import DepartmentList from "./DepartmentList";
export default function Department() {

    const display = pathContains(DEPARTMENTS);

    return (
        display &&
        <div className="Department">
            <div className="row">
                <div className="col">
                    <AddDepartment />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <DepartmentList />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <EditDepartment />
                </div>
            </div>
        </div>
    )
}