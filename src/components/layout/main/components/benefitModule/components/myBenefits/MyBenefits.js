import { getHost } from "../../../../../../../utility/APIService";
import SearchBar from "../../../../../../forms/searchBar/SearchBar";
import Entries from "../../../../../../forms/entries/Entries";
import BenefitFilter from "../../../../../../forms/benefitFilter/BenefitFilter";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../../../../forms/button/Button";
import Title from "../../../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { getEmployeeID } from "../../../../../../../utility/Session";
import PrintButton from "../../../../../../forms/printButton/PrintButton";
import TableFooter from "../../../table/components/TableFooter";

export default function MyBenefits() {

    const HOST = getHost();
    const employee = getEmployeeID();
    const defaultPath =  "benefits/employee=" + employee + "/";
    const [path, setPath] = useState("");
    const [data, setData] = useState([]);
    const [order, setOrder] = useState("");
    const [entry, setEntry] = useState(0);
      
    const [searchTerm, setSearchTerm] = useState("");

    const initialValues = {
        employee: employee,
        startDate: "",
        endDate: "",
    }

    const [filterData, setFilterData] = useState(initialValues);
    
    const handleFilterChange = (e) => {
        e.preventDefault();
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }

    let { startDate, endDate } = filterData;

    useEffect(() => {

        let newPath = "";
        setPath(newPath ? defaultPath + newPath : defaultPath);

    }, [employee, startDate, endDate, order, defaultPath ]);

    const fetchData = useCallback(async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST, path ])
   
    useEffect(() => {
        path && fetchData();
    }, [ path, fetchData ])

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
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={
                                    () => {
                                        setSearchTerm("");
                                        fetchData(defaultPath);
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
                                employeeID={employee}
                                table="my benefit"
                                title="Employee Benefits"
                                from={startDate}
                                to={endDate}
                                header={header} 
                                data={data} 
                            />
                      </div>  
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <BenefitFilter 
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
        { id: "id", name: "ID" },
        { id: "government_company", name: "Company/Benefit" },
        { id: "employer_share", name: "Employer Share" },
        { id: "employer_share_percent", name: "% of Employer Share" },
        { id: "employee_share", name: "Employee Share" },
        { id: "employee_share_percent", name: "% of Employee Share" },
        { id: "total", name: "Total" },
        { id: "total_percent", name: "Total %" },
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
                    return (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.employer_share}</td>
                            <td>{item.employer_share_percent}</td>
                            <td>{item.employee_share}</td>
                            <td>{item.employee_share_percent}</td>
                            <td>{item.total}</td>
                            <td>{item.total_percent}</td>
                            <td>{item.contribution_deadline}</td>
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