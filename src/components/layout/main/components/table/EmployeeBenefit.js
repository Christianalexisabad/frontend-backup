import { isPath } from "../../../../../utility/Functions";
import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../../forms/button/Button";
import Title from "../../../../forms/title/Title";
import CustomLink from "../../../../forms/customLink/CustomLink";
import PrintButton from "../../../../forms/printButton/PrintButton";
import { ADD_BENEFITS } from "../../../../../utility/Route";
import BenefitFilter from "../../../../forms/benefitFilter/BenefitFilter";
import axios from "axios";
import "./Table.css";
import TableFooter from "./components/TableFooter";

export default function EmployeeBenefit() {

    const display = isPath("/pages/employee/benefits/");
    const HOST = getHost();
    const defaultPath = "benefits/";
    const [path, setPath] = useState("");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("");

    const fetchData = useCallback(async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL);
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST, path ]);

    const initialData = {
        filterValue: null, 
        department: null, 
        employee: null,  
        startDate: "", 
        endDate: "",
    }   

    const [filterData, setFilterData] = useState(initialData);
    
    const handleFilterChange = (e) => {
        e.preventDefault();
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }
    let { department, employee, startDate, endDate } = filterData;

    useEffect(() => {

        let newPath = "";

        let application_date_range = startDate + ":" + endDate;

        newPath = department && employee && startDate && endDate && order? "department=" + department + "/employee=" + employee + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    department && employee && startDate && endDate ? "department=" + department + "/employee=" + employee + "/application_date_range=" + application_date_range + "/" :
                    department && employee && order ? "department=" + department + "/employee=" + employee + "/order=" + order + "/":
                    department && employee ? "department=" + department + "/employee=" + employee + "/":
                    department && startDate && endDate && order ? "department=" + department + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    department && startDate && endDate ? "department=" + department + "/application_date_range=" + application_date_range + "/" :
                    department && order ? "department=" + department + "/order=" + order + "/":
                    department ? "department=" + department + "/" : 
                    employee && startDate && endDate && order ? "employee=" + employee + "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    employee && startDate && endDate ? "employee=" + employee + "/application_date_range=" + application_date_range + "/" :
                    employee && order ? "employee=" + employee + "/order=" + order + "/": 
                    employee ? "employee=" + employee + "/" : 
                    startDate && endDate && order ? "/application_date_range=" + application_date_range + "/order=" + order + "/":
                    startDate && endDate ? "/application_date_range=" + application_date_range + "/" :
                    order ? "order=" + order + "/" : "";   

        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [department, employee, startDate, endDate, order]);

    useEffect(() => {
        display && path && fetchData();
    }, [ display, path, fetchData ])

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
                                fontSize="25px"
                                text="Benefits"
                            />
                            <CustomLink 
                                text="Add Benefit"
                                permission="can_add_benefit"
                                to={ADD_BENEFITS}
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
                            width="200px"
                            value={data.length}
                            entries={entry}
                            onChange={handleEntry}
                        />
                    </div>
                    <div className="col-right col-lg-6">
                        <PrintButton 
                            table="benefit"
                            title="Employee Benefits"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-12">
                        <BenefitFilter 
                            data={filterData}
                            onChange={handleFilterChange}
                            onCancel={()=> setFilterData(initialData)}                                
                        />
                    </div>
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "No" },
        { id: "employee__employee_no", name: "Employee No" },
        { id: "employee__name", name: "Employee Name" },
        { id: "government_company__name", name: "Company" },
        { id: "employer_share", name: "Employer Share" },
        { id: "employer_share_percent", name: "% Employer Share" },
        { id: "employee_share", name: "Employee Share" },
        { id: "employee_share_percent", name: "% Employere Share" },
        { id: "total", name: "Total" },
        { id: "total_percent", name: "% total" },
        { id: "contribution_deadline", name: "Contribution Deadline"},
    ]

    function renderTableHeader() {
        return (
            <thead> 
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{ item.name }</span>
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
                {data.length > 0 && data.map((item, index) => {

                    const { employee, government_company ,employer_share, employer_share_percent, employee_share, employee_share_percent, total, total_percent, contribution_deadline } = item;
                    const { employee_no, sur_name, first_name } = employee;
                    const name = first_name + " " + sur_name;

                    return (
                        <tr key={item.id}>
                            <td>{index+=1}</td>
                            <td>{employee_no}</td>
                            <td>{name}</td>
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