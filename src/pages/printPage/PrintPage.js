import { FullName, getData, getApprovalStatus, getStr, has, getAttendanceStatus, Name } from "../../utility/Functions";
import { getHost } from "../../utility/APIService";
import "./PrintPage.css";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getDateTime } from "../../utility/DateTime";

const PrintPage = () => {

    const HOST = getHost();

    const { 
        employeeID,
        table,
        title,
        header, 
        data,
        from,
        to,
    } = JSON.parse(localStorage.getItem("toPrint"));

    const [employeeData, setEmployeeData] = useState({}); 

    useEffect(() => {
        employeeID && setEmployeeData(data[0].employee)
    }, [employeeID, data ]);

    const { employee_no, sur_name, first_name } = employeeData; 
    const name = first_name + " " + sur_name;

    const styles = {
        container: {
            padding: '10px 20px'
        }
    }

    const [Statuses, setStatuses] = useState({});

    const fetchStatuses = useCallback(async () => {
        const response = await axios.get(HOST + "/api/attendance-statuses/")
        const { data } = await response.data;
        setStatuses(data);
    }, [ HOST ]);

    useEffect(() => {
        fetchStatuses();
    }, [ fetchStatuses ])

    // useEffect(() => {
    //     setTimeout(() => window.prin(), 100)
    // }, [])

    function renderHeader() {

        const List = [
            { label: "Employee: ", value: employeeID ? employee_no + ", " + name : "All"},
            { label: "Date: ", value: from !== to ? !from || !to ? <span>Any</span> : <span>{from} <b>-</b> {to}</span> : <span>{from ? from : "All"}</span>, display: true},
            { label: "Date Printed: ", value: getDateTime(), display: true},
        ]

        return (
            <div className="row header">
                <div className="col-lg-12">
                    <h1>{title}</h1>
                    <ul className="m-0 p-0">
                        {List.map((item, index) => {
                            return (
                                <li key={index}> 
                                    <label><b>{item.label}</b></label>
                                    <span> {item.value} </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
    
    function renderEmployeeTable(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        {header.map((item, index) => {
                            return (
                                <th key={index}>
                                    <span>{item.name}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, index) => {
                    const { id, employee_no, employee_type, position, date_hired } = item;
                    const name = Name(item);
                    const { department, title } = position;
                    const department_head = Name(department.department_head);

                    return (
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{employee_no}</td>
                            <td>{name}</td>
                            <td>{department.name}</td>
                            <td>{department_head}</td>
                            <td>{title}</td>
                            <td>{employee_type.name}</td>
                            <td>{date_hired}</td>
                        </tr>
                        )
                    }) : <tr className="text-center text-secondary"><td>No data to show...</td></tr> } 
                </tbody>
            </table>
        )
    }

    function renderAttendanceTable(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        {header.map((item, index) => {
                            return (
                                <th key={index}>
                                    <span>{item.name}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, index) => {
    
                        let {date, am_in, am_out, am_status, pm_in, pm_out, pm_status } = item;
                        const empNo = item.employee.employee_no;
                        const name = FullName(item.employee);
                        
                        try {
                            am_status =  getData(am_status, "name", Statuses);
                            pm_status =  getData(pm_status, "name", Statuses);
                        } catch (error) {
                            console.log(error);
                        }

                        const isAttendace = table === 'attendance' ? true : false;

                        return (
                            <tr key={index}>
                                <td>{index+=1}</td>
                                {isAttendace && <td>{empNo}</td>}
                                {isAttendace && <td>{name}</td>}
                                <td>{getStr(am_in)}</td>
                                <td>{getAttendanceStatus(am_out)}</td>
                                <td>{getAttendanceStatus(am_status)}</td>
                                <td>{getStr(pm_in)}</td>
                                <td>{getAttendanceStatus(pm_out)}</td>
                                <td>{getAttendanceStatus(pm_status)}</td>
                                <td>{date}</td>
                            </tr>
                        )
        
                    }) : <tr>
                        <td colSpan={header.length} className="text-secondary text-center"> No records found </td>
                    </tr>
                    }
                </tbody>
            </table>
        )
    }

    function renderLeaveTable(){

        return (
            <table className="table">
                <thead>
                <tr>
                    {header.map((item, index) => {
                        const isRemarks = item.id === "leave_status" ? true : false;
                        return !isRemarks ?
                            <th key={index}>
                                <span>{ item.name }</span>
                            </th> : <th>
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
                <tbody>
                    {data.length > 0 ? data.map((item, index) => {

                    const isLeave = table === 'leave' ? true : false;

                    const { employee, leave_type, other_details, days_applied, start_date, end_date, supervisor_remarks, hr_remarks, application_date } = item;
                    const { employee_no, first_name, sur_name } = employee;
                    const name = first_name + " " + sur_name;

                    return (
                        <tr key={index}>
                            <td>{index+=1}</td>
                            {isLeave && <td>{employee_no}</td>}
                            {isLeave && <td>{name}</td>}
                            <td>{leave_type.name}</td>
                            <td>{other_details}</td>
                            <td>{days_applied}</td>
                            <td>{start_date}</td>
                            <td>{end_date}</td>
                            <td>
                                <label className="w-50 text-center">{getApprovalStatus(supervisor_remarks)}</label>
                                <label className="w-50 text-center">{getApprovalStatus(hr_remarks)}</label>
                            </td>
                            <td>{application_date}</td>
                        </tr>
                    )
                    }) : <tr className="text-center text-secondary"><td colSpan={header.length}>No leave applications yet</td></tr> } 
                </tbody>
            </table>
        )
    }

    function renderBenefitTable(){
        return (
            <table className="table">
                <thead>
                    <tr>
                        {header.map((item, index) => {
                            return (
                                <th key={index}>
                                    <span>{item.name}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 && data.map((item, index) => {

                        const isBenefit = table === 'benefit' ? true : false;

                        const { employee, government_company ,employer_share, employer_share_percent, employee_share, employee_share_percent, total, total_percent, contribution_deadline } = item;
                        const { employee_no, sur_name, first_name } = employee;
                        const name = first_name + " " + sur_name;

                        return (
                            <tr key={item.id}>
                                <td>{index+=1}</td>
                                {isBenefit && <td>{employee_no}</td>}
                                {isBenefit && <td>{name}</td>}
                                <td>{government_company.name}</td>
                                <td>{employer_share}</td>
                                <td>{employer_share_percent}</td>
                                <td>{employee_share}</td>
                                <td>{employee_share_percent}</td>
                                <td>{total}</td>
                                <td>{total_percent}</td>
                                <td>{contribution_deadline}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <section className="PrintPage">
            <div className="row">
                <div className="col-lg-12">
                    <div className="content" style={styles.container}>
                        {renderHeader()}
                        {
                            has(table, 'attendance') ? renderAttendanceTable() : 
                            has(table, 'leave') ? renderLeaveTable() : 
                            has(table, 'benefit') ? renderBenefitTable() : 
                            renderEmployeeTable()
                        }
                    </div>
                </div>
            </div>
        </section>
    )   
}
    
export default PrintPage;