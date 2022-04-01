import { hasPermission } from "../../../../../utility/Permission";
import CustomLink from "../../../../forms/customLink/CustomLink";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import { clean, getData, isPath } from "../../../../../utility/Functions";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { GENERATE_REPORT, UPLOAD_REPORT } from "../../../../../utility/Route";
import PreviewButton from "../../../../forms/previewButton/PreviewButton";
import { getEmployeeID } from "../../../../../utility/Session";
import TableFooter from "./components/TableFooter";

export default function Report() {

    const display = isPath("/pages/reports/");
    const employeeID = getEmployeeID();
    /* eslint-disable no-unused-vars */
    const [endpoint, setEndpoint] = useState(getHost() + "/api/reports/");
    const canViewEmployeeReport = hasPermission("can_view_employee_report");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [Types, setTypes] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [myReport, setMyReport] = useState(false);

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(await data);
    }

    const fetchEntry = async () => {
        const response =      axios.get(endpoint + "total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    const fetchTypes = async () => {
        const response = await axios.get(getHost() + "/api/report-types/")
        const { data } = await response.data;
        setTypes(data); 
    }

    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/")
        const { data } = await response.data;
        setEmployees(data); 
    }

    useEffect(() => {
        if (display) {
            fetchEmployees();
            fetchTypes();
            fetchData(endpoint);
            fetchEntry();
        }
    /* eslint-disable react-hooks/exhaustive-deps */
    },[display])

    useEffect(() => {
        myReport ?
        fetchData(getHost() + "/api/reports/" + employeeID + "/") : 
        fetchData(getHost() + "/api/reports/")
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [myReport])

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        fetchData(searchTerm ? endpoint + "search="+searchTerm+"/" : endpoint);
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
        fetchData(endpoint + "order="+order+"/")
    }

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Reports"
                            />
                            <CustomLink 
                                text="Generate Report"
                                to={GENERATE_REPORT}
                            />
                            <CustomLink 
                                text="Upload Report"
                                to={UPLOAD_REPORT}
                            />
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={
                                    () => {
                                        setSearchTerm("");
                                        fetchData(endpoint);
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
                            <Button 
                                text={myReport ? "All Reports" : "My Reports"}
                                onClick={()=> setMyReport(myReport ? false : true)}
                             />
                        </div>
                        <div className="col-right col-lg-6">
                            <Download data={data}/>
                        </div>  
                </div>
            </div>
        )
    }

    function renderTableHeader() {

        const data = [
            { id: "id", name: "no", display: true},
            { id: "report_type", name: "title", display: true},
            { id: "employee", name: "employee", display: canViewEmployeeReport},
            { id: "attachement", name: "attachment", display: true},
            { id: "created_at", name: "date submitted", display: true},
        ];

        return (
            <thead>
                <tr>
                    {data.map(item => {
                        return (
                            item.display &&
                            <th>
                                {clean(item.name)}
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
                            </th>
                        )
                    })}
                    {/* <th className="text-center">Action</th> */}
                </tr>
            </thead>
        )
    }


    function renderTableBody() {

        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    return (
                        <tr>
                            <td>{index+=1}</td>
                            <td>{getData(item.report_type, "name", Types)}</td>
                            {canViewEmployeeReport && <td>{getData(item.employee, "first_name", Employees) + " " + getData(item.employee, "sur_name", Employees)}</td>}
                            <td>
                                <PreviewButton to={item.attachement} />
                            </td>
                            <td>{item.created_at.split("T")[0]}</td>
                            {/* <td className="text-center">
                                <ArchiveButton 
                                    table="reports"
                                    id={item.id}
                                    is_archived={item.is_archived}
                                />
                            </td> */}
                        </tr>
                    )
                }) : <tr className="text-center text-secondary"><td>No data to show...</td></tr> } 
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