import { getEmployeeID } from "../../../../../../../utility/Session";
import CustomLink from "../../../../../../forms/customLink/CustomLink";
import SearchBar from "../../../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../../../utility/APIService";
import Print from "../../../../../../forms/printButton/PrintButton";
import { getApprovalStatus, isPath } from "../../../../../../../utility/Functions";
import Entries from "../../../../../../forms/entries/Entries";
import Button from "../../../../../../forms/button/Button";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Title from "../../../../../../forms/title/Title";
import LeaveFilter from "../../../../../../forms/leaveFilter/LeaveFilter";
import "./MyLeave.css";
import { APPLY_LEAVE } from "../../../../../../../utility/Route";
import TableFooter from "../../../table/components/TableFooter";

export default function MyLeave() {

    const display = isPath("/pages/leave/");
    const HOST = getHost();
    const employee = getEmployeeID();
    let defaultPath = "employee-leaves/employee="+ employee +"/";
    const [path, setPath] = useState("");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("-id");
    
    const fetchData = useCallback(async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST, path ])

    const initialValues = {
        employee: employee,
        status: "", 
        startDate: "",
        endDate: "",
    }

    const [filterData, setFilterData] = useState(initialValues);
    
    const handleFilterChange = (e) => {
        e.preventDefault();
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }

    let { status, startDate, endDate } = filterData;

    useEffect(() => {

        let newPath = "";

        let application_date_range = startDate + ":" + endDate;

        newPath = startDate && endDate && status && order ? "status=" + status + "/application_date_range=" + application_date_range + "/order=" + order + "/" : 
                startDate && endDate && status ? "status=" + status + "/application_date_range=" + application_date_range + "/" : 
                startDate && endDate && order ? "/application_date_range=" + application_date_range + "/order=" + order + "/" : 
                startDate && endDate ? "/application_date_range=" + application_date_range + "/": 
                status && order ?  "status=" + status + "/order=" + order + "/" :
                status ?  "status=" + status + "/" : 
                order ?  "order=" + order + "/" : ""

        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [ startDate, endDate, status, order, defaultPath ]);

    useEffect(() => {
        display && path && fetchData();
    }, [display, path, fetchData])

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        fetchData(searchTerm ? defaultPath + "search="+searchTerm+"/" : defaultPath);
    }

    const handleEntry = (e) => {
        e.preventDefault();
        setEntry(parseInt(e.target.value));
    }

     const handleSort = (e) => {
        e.preventDefault();
        let id = e.target.id;
        let order = id.startsWith("-") ? id.replace("-", "") : "-" + id;
        e.target.id = order;
        alert(order)
        setOrder(order);
    }

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Leave Applications"
                            />
                            <CustomLink 
                                text="Apply Leave"
                                to={APPLY_LEAVE}
                            />
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={
                                    () => {
                                        setSearchTerm("");
                                        fetchData();
                                    }
                                }
                            />
                        </div>
                        <div className="col-right col-lg-6">
                            <SearchBar 
                                value={searchTerm}
                                onChange={handleSearchBarChange}
                            />
                        </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-6">
                        <Entries 
                            value={entry}
                            entries={data.length}
                            onChange={handleEntry}
                        />
                    </div>
                    <div className="col-right col-lg-6">
                        <Print 
                            employee={employee}
                            table="my leave"
                            title="Leave Applications"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <LeaveFilter 
                            data={filterData}
                            onChange={handleFilterChange}
                            onClear={()=> setFilterData(initialValues)}                                
                        />
                    </div>
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "No" },
        { id: "leave_type", name: "Leave Type" },
        { id: "other_details", name: "Other Details" },
        { id: "days_applied", name: "Working Days Applied" },
        { id: "start_date", name: "Start Date" },
        { id: "end_date", name: "End date" },
        { id: "leave_status", name: "Status"},
        { id: "application_date", name: "Date Applied"},
    ]

    function renderTableHeader() {
        return (
            <thead> 
                <tr>
                    {header.map((item, index) => {
                        const isRemarks = item.id === "leave_status" ? true : false;
                        return !isRemarks ?
                            <th key={index}>
                                <span>{ item.name }</span>
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
                            </th> : 
                            <th key={index}>
                                <div className="row">
                                    <div className="col-lg-12 text-center">
                                        Status
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 text-center">
                                        Dept. Head  
                                    </div>
                                    <div className="col-lg-6 text-center">
                                        HR
                                    </div>
                                </div>
                            </th>
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
                    index < entry &&
                    <tr key={index}>
                        <td>{index+=1}</td>
                        <td>{item.leave_type.name}</td>
                        <td>{item.other_details}</td>
                        <td>{item.days_applied}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date}</td>
                        <td>
                            <div className="row">
                                <div className="col-lg-6 text-center">
                                    {getApprovalStatus(item.supervisor_remarks)}
                                </div>
                                <div className="col-lg-6 text-center">
                                    {item.supervisor_remarks === -1 ? "N/A" : getApprovalStatus(item.hr_remarks)}
                                </div>
                            </div>
                        </td>
                        <td>{item.application_date}</td>
                    </tr>
                )
                }) : <tr className="text-center text-secondary"><td colSpan={header.length}>No leave applications yet</td></tr> } 
            </tbody>
        )   
    }

    function renderTable() {
        return (
            <table className="table">
                {renderTableHeader()}
                {renderTableBody()}
            </table>
        )
    }

    function renderContent (){
        return (
            <div className="content">
                <div className="row">
                    <div className="col-lg-12">            
                        <div className="tableContainer" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.50) }}>
                            {renderTable()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }



     return (
        <div className="MyLeave bg-white">
            <div className="row">
                <div className="col-lg-12">
                    {renderHeader()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    {renderContent()}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <TableFooter 
                        total={data.length}
                        current={entry}
                    />
                </div>
            </div>
        </div>
    )
}