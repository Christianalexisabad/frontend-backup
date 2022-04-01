
import { getData, getStr, isPath } from "../../../../../utility/Functions";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Print from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect, useCallback } from "react";
import Title from "../../../../forms/title/Title";
import Button from "../../../../forms/button/Button";
import axios from "axios";
import "./Table.css";
import { getEmployeeID, getRole } from "../../../../../utility/Session";
import AttendanceFilter from "../../../../forms/attendanceFilter/AttendanceFilter";
import TableFooter from "./components/TableFooter";

export default function EmployeeAttendance() {

    const display = isPath("/pages/employee/attendance/");
    const isHR = getRole() === 3 ? true : false;
    const HOST = getHost();
    const departmentHead = getEmployeeID();
    const defaultPath = isHR ? "attendances/" : "attendances/department_head=" + departmentHead  + "/";
    const [path, setPath] = useState("");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("");

    const [AttendanceStatuses, setAttendanceStatuses] = useState([]);
    const fetchAttendanceStatuses = useCallback(async() => {
        const response = await axios.get(HOST + "/api/attendance-statuses/");
        let { data } = await response.data;
        setAttendanceStatuses(data);
    }, [ HOST ]);

    useEffect(() => {
        fetchAttendanceStatuses();
    }, [ fetchAttendanceStatuses ])

    const fetchData = useCallback(async (defaultPath) => {
        const response = await axios.get(HOST + "/api/" + defaultPath)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST ]);

    const initialValues = {
        filterValue: "", 
        department: "", 
        employee: "", 
        status: "", 
        startDate: "", 
        endDate: "",
    }
    
    const [filterData, setFilterData] = useState(initialValues);
    const handleFilterChange = (e) => {
        e.preventDefault();
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }
    let { filterValue, department, employee, status, startDate, endDate } = filterData;

    useEffect(() => {

        let newPath = "";
        let date_range = startDate + ":" + endDate;

          newPath = department && employee && status && startDate && endDate && order ? "department=" + department + "/employee=" + employee + "/status=" + status + "/date_range=" + date_range + "/order=" + order + "/":
                    department && employee && status && startDate && endDate ? "department=" + department + "/employee=" + employee + "/status=" + status + "/date_range=" + date_range + "/" :
                    department && employee && status && order ? "department=" + department + "/employee=" + employee + "/status=" + status + "/order=" + order + "/":
                    department && employee && status ? "department=" + department + "/employee=" + employee + "/status=" + status + "/":
                    department && startDate && endDate && order ? "department=" + department + "/date_range=" + date_range + "/end_date=" + endDate + "/order=" + order + "/":
                    department && startDate && endDate ? "department=" + department + "/date_range=" + date_range + "/" :
                    department && employee && order ? "department=" + department + "/employee=" + employee + "/order=" + order + "/":
                    department && employee ? "department=" + department + "/employee=" + employee + "/":
                    department && status && order ? "department=" + department + "/status=" + status + "/order=" + order + "/":
                    department && status ? "department=" + department + "/status=" + status + "/":
                    department && order ? "department=" + department + "/order=" + order + "/": 
                    department ? "department=" + department + "/" : 
                    employee && status && startDate && endDate && order ? "employee=" + employee + "/status=" + status + "/date_range=" + date_range + "/order=" + order + "/":
                    employee && status && startDate && endDate ? "employee=" + employee + "/status=" + status + "/date_range=" + date_range + "/" :
                    employee && startDate && endDate && order ? "employee=" + employee + "/date_range=" + date_range + "/order=" + order + "/":
                    employee && startDate && endDate ? "employee=" + employee + "/date_range=" + date_range + "/" :
                    employee && status && order ? "employee=" + employee + "/status=" + status + "/order=" + order + "/":
                    employee && status ? "employee=" + employee + "/status=" + status + "/" :
                    employee && order ? "employee=" + employee + "/order=" + order + "/": 
                    employee ? "employee=" + employee + "/" : 
                    status && startDate && endDate && order ? "status=" + status + "/date_range=" + date_range + "/order=" + order + "/":
                    status && startDate && endDate ? "status=" + status + "/date_range=" + date_range + "/" :
                    status ? "status=" + status + "/order=" + order + "/":
                    status ? "status=" + status + "/" :
                    startDate && endDate && order ? "date_range=" + date_range + "/order=" + order + "/":
                    startDate && endDate ? "date_range=" + date_range + "/" :
                    order ? "order=" + order + "/" : "";   

        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [ defaultPath, order, filterValue, department, employee, startDate, endDate, status]);

    useEffect(() => {
        display && path && fetchData(path);
    }, [display, path, fetchData ]);

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
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
        setOrder(order);
    }

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Attendance"
                            />
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={
                                    () => {
                                        fetchData(path)
                                    }
                                }
                            />
                        </div>
                        <div className="col-right col-lg-6">
                            <SearchBar 
                                value={searchTerm}
                                onClear={() => setSearchTerm("")}
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
                            table="attendance"
                            title="Attendance List"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-12">
                        <AttendanceFilter 
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
        { id: "employee_no", name: "Employee No" },
        { id: "employee__sur_name", name: "Employee Name" },
        { id: "am_in", name: "AM In" },
        { id: "am_out", name: "AM Out" },
        { id: "am_status", name: "Status" },
        { id: "pm_in", name: "PM In" },
        { id: "pm_out", name: "PM Out" },
        { id: "pm_status", name: "Status" },
        { id: "date", name: "Date" },
    ]

    function renderTableHeader() {

        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{item.name}</span>
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.map((item, index) => {

                    const { date, am_in, am_out, am_status, pm_in, pm_out, pm_status, employee } = item;
                    const { employee_no, sur_name, first_name } = employee;
                    const name = first_name + " " + sur_name;

                    return (
                            index < entry &&
                            <tr key={index}>
                                <td>{index+=1}</td>
                                <td>{employee_no}</td>
                                <td>{name}</td>
                                <td>{getStr(am_in)}</td>
                                <td>{getStr(am_out)}</td>
                                <td>{getData(am_status, "name", AttendanceStatuses)}</td>
                                <td>{getStr(pm_in)}</td>
                                <td>{getStr(pm_out)}</td>
                                <td>{getData(pm_status, "name", AttendanceStatuses)}</td>
                                <td>{date}</td>
                            </tr>
                    )
                })}
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
        display &&
        <div className="Table bg-white">
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