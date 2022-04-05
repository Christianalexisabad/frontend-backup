
import { getLeaveBalanceData, getApprovalStatus } from "../../../../../utility/Functions";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import ApproveButton from "../../../../forms/approveButton/ApproveButton";
import DeclineButton from "../../../../forms/declineButton/DeclineButton";
import { getCurrentDate } from "../../../../../utility/DateTime";
import { getEmployeeID, getRole } from "../../../../../utility/Session";
import ConfirmDialog from "../../../../forms/confirmDialog/ConfirmDialog";
import AlertMessage from "../../../../forms/alert/AlertMessage";
import LeaveFilter from "../../../../forms/leaveFilter/LeaveFilter";
import PrintButton from "../../../../forms/printButton/PrintButton";
import TableFooter from "./components/TableFooter";

const initialData = {
    filterValue: null, 
    department: null, 
    employee: null,  
    status: null, 
    startDate: "", 
    endDate: "",
}

export default function EmployeeLeaveList(props) {
    
    const display = true;
    const isHR = getRole() === 3 ? true : false;
    const HOST = getHost();
    const departmentHead = getEmployeeID();
    const defaultPath = isHR ? "employee-leaves/" : "employee-leaves/department_head=" + departmentHead  + "/";
    const [path, setPath] = useState("");
    
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [toUpdate, setToUpdate] = useState(null);
    const [order, setOrder] = useState("-id");

    const fetchData = async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL);
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }

    const [LeaveBalances, setLeaveBalances] = useState([]);
 
    const fetchLeaveBalances = async () => {
        const response = await axios.get(getHost() + "/api/leave-balances/")
        const { data } = await response.data;
        setLeaveBalances(data); 
    }

    const [filterData, setFilterData] = useState(initialData);
    
    const handleFilterChange = (event) => {
        event.preventDefault();
        setFilterData({ ...filterData, [event.target.id]: event.target.value })
    }

    let { department, employee, status, startDate, endDate } = filterData;

    useEffect(() => {

        let newPath = "";

        let application_date_range = startDate + ":" + endDate;

        newPath = department && employee && status && startDate && endDate && order? "department=" + department + "/employee=" + employee + "/status=" + status + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    department && employee && status && startDate && endDate ? "department=" + department + "/employee=" + employee + "/status=" + status + "/application_date_range=" + application_date_range + "/" :
                    department && employee && status && order ? "department=" + department + "/employee=" + employee + "/status=" + status + "/order=" + order + "/":
                    department && employee && status ? "department=" + department + "/employee=" + employee + "/status=" + status + "/":
                    department && employee && order ? "department=" + department + "/employee=" + employee + "/order=" + order + "/":
                    department && employee ? "department=" + department + "/employee=" + employee + "/":
                    department && startDate && endDate && order ? "department=" + department + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    department && startDate && endDate ? "department=" + department + "/application_date_range=" + application_date_range + "/" :
                    department && status && order ? "department=" + department + "/status=" + status + "/order=" + order + "/":
                    department && status ? "department=" + department + "/status=" + status + "/":
                    department && order ? "department=" + department + "/order=" + order + "/": 
                    department ? "department=" + department + "/" : 
                    employee && status && startDate && endDate ? "employee=" + employee + "/status=" + status + "/application_date_range=" + application_date_range + "/" :
                    employee && status ? "employee=" + employee + "/status=" + status + "/" :
                    employee && startDate && endDate ? "employee=" + employee + "/application_date_range=" + application_date_range + "/" :
                    employee && order ? "employee=" + employee + "/order=" + order + "/": 
                    employee ? "employee=" + employee + "/" : 
                    status && startDate && endDate && order ? "status=" + status + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    status && startDate && endDate ? "status=" + status + "/application_date_range=" + application_date_range + "/" :
                    status && order ? "status=" + status + "/order=" + order + "/":
                    status ? "status=" + status + "/" :
                    startDate && endDate && order ? "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    startDate && endDate ? "/application_date_range=" + application_date_range + "/" :
                    order ? "order=" + order + "/" : "";   
        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [ department, employee, startDate, endDate, status, order, defaultPath ]);

    useEffect(() => {
        if (display) {
            fetchLeaveBalances();
        }
    /* eslint-disable react-hooks/exhaustive-deps */
    },[display])

    useEffect(() => {
        path && fetchData();
    }, [path]);

    const handleSearchBarChange = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    }

    const handleEntry = (event) => {
        event.preventDefault();
        setEntry(parseInt(event.target.value));
    }   

     const handleSort = (event) => {
        event.preventDefault();
        let id = event.target.id;
        let order = id.startsWith("-") ? id.replace("-", "") : "-" + id;
        event.target.id = order;
        setOrder(order);
    }

    const header = [
        { id: "id", name: "No" },
        { id: "employee__employee_no", name: "Employee No" },
        { id: "employee__name", name: "Employee Name" },
        { id: "leave_type", name: "Leave type" },
        { id: "other_details", name: "Other details" },
        { id: "days_applied", name: "Working Days Applied" },
        { id: "start_date", name: "Start Date" },
        { id: "end_date", name: "End Date" },
        { id: "leave_status", name: "Status"},
        { id: "application_date", name: "Date Applied"}
    ]

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Leave Applications"
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
                        <PrintButton 
                            table="leave"
                            title="Employee Leaves"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-12">
                        <LeaveFilter 
                            data={filterData}
                            onChange={handleFilterChange}
                            onClear={()=> setFilterData(initialData)}                                
                        />
                    </div>
                </div>
            </div>
        )
    }

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
                {data.length > 0 && data.map((item, index) => {
                const { id, employee, leave_type, days_applied, other_details, start_date, end_date, supervisor_remarks, hr_remarks } = item;
                const { employee_no, sur_name, first_name } = employee;
                
                const name = first_name + " " + sur_name;
                const leaveBalanceID = getLeaveBalanceData(employee, leave_type, LeaveBalances, "id");
                const availableLeave = getLeaveBalanceData(employee, leave_type, LeaveBalances, "available");
                const approvedLeave = getLeaveBalanceData(employee, leave_type, LeaveBalances, "approved");

                return (
                    <tr key={index}>
                        <td>{index+=1}</td>
                        <td>{employee_no}</td>
                        <td>{name}</td>
                        <td>{leave_type.name}</td>
                        <td>{other_details}</td>
                        <td>{days_applied}</td>
                        <td>{start_date}</td>
                        <td>{end_date}</td>
                        <td>
                            <div className="row">
                                <div className="col-lg-6 text-center">
                                    {
                                        supervisor_remarks === 0 ? 
                                        <span>
                                            <ApproveButton 
                                                onClick={() => {
                                                    setToUpdate({
                                                        method: "update",
                                                        url: HOST + "/api/employee-leaves/approve/"+ id +"/",
                                                        message: "Are you sure you want to approve the leave of employee "+ name +"?",
                                                        data: {
                                                            supervisor_remarks: 1,
                                                            supervisor_approval_date: getCurrentDate(),
                                                        }
                                                    })
                                                }}  
                                            />
                                            <DeclineButton 
                                                onClick={() => {
                                                    setToUpdate({
                                                        method: "update",
                                                        url: HOST + "/api/employee-leaves/decline/"+ id +"/",
                                                        message: "Are you sure you want to decline the leave of employee "+ name +"?",
                                                        data: {
                                                            supervisor_remarks: 2,
                                                            supervisor_approval_date: getCurrentDate(),
                                                        }
                                                    })
                                                }}  
                                            />
                                        </span> : getApprovalStatus(supervisor_remarks)
                                    }
                                </div>
                                <div className="col-lg-6 text-center">
                                    {
                                        getRole() === 3 ?
                                        supervisor_remarks === 1 && hr_remarks !== 1 ?
                                        <span>
                                            <ApproveButton 
                                                onClick={() => {

                                                    const available = availableLeave - days_applied;
                                                    const aprroved = approvedLeave + days_applied;

                                                    axios.patch(getHost() + "/api/leave-balances/update/"+ leaveBalanceID +"/", {
                                                        available: available,
                                                        approved: aprroved
                                                    })

                                                    setToUpdate({
                                                         method: "update",
                                                        url: HOST + "/api/employee-leaves/approve/"+ id +"/",
                                                        message: "Are you sure you want to approve the leave of employee "+ name +"?",
                                                        data: {
                                                            hr_remarks: 1,
                                                            hr_approval_date: getCurrentDate(),
                                                        }
                                                    })
                                                }}  
                                            />
                                            <DeclineButton 
                                                onClick={() => {
                                                    setToUpdate({
                                                        method: "update",
                                                        url: HOST + "/api/employee-leaves/decline/"+ id +"/",
                                                        message: "Are you sure you want to decline the leave of employee "+ name +"?",
                                                        data: {
                                                            hr_remarks: 2,
                                                            hr_approval_date: getCurrentDate(),
                                                        }
                                                    })
                                                }}  
                                            />
                                        </span> : supervisor_remarks === 2 ? "---" : getApprovalStatus(hr_remarks)
                                        : supervisor_remarks === 2 ? "---" : getApprovalStatus(hr_remarks)
                                    }
                                </div>
                            </div>
                        </td> 
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
                        <div className="tableContainer" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.50), overflowX: 'hidden', overflowY: 'auto' }}>
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
            <ConfirmDialog data={toUpdate} onCancel={()=> setToUpdate(null)} />
            <AlertMessage message={message} onClose={()=> setMessage("")} />
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