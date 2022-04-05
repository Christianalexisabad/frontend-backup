
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect, useCallback } from "react";
import Title from "../../../../forms/title/Title";
import CustomLink from "../../../../forms/customLink/CustomLink";
import axios from "axios";
import EditButton from "../../../../forms/editButton/EditButton";
import Button from "../../../../forms/button/Button";
import "./Table.css";
import { ADD_LEAVE_TYPE, EDIT_LEAVE_TYPE } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function LeaveType(props) {

    const endpoint = getHost() + "/api/leave-types/";
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = useCallback(async () => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(data);
    }, [ endpoint ])

    useEffect(() => {
        fetchData();
    },[ fetchData ])

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    }

    const handleEntry = (e) => {
        e.preventDefault();
        setEntry(parseInt(e.target.value));

    }
    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Leave Types"
                            />
                            <CustomLink 
                                text="Add Leave Type"
                                // permission="can_add_position"
                                to={ADD_LEAVE_TYPE}
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
                        </div>
                        <div className="col-right col-lg-6">
                            <Download data={data}/>
                        </div>  
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "no"},
        { id: "name", name: "name"},
        { id: "duration", name: "applicable leave/duration(days)"},
    ];

    function renderTableHeader() {
        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{item.name}</span>
                            </th>
                        )
                    })}
                    <th className="text-center">Action</th>
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    const { id, name, duration } = item;
                    return (
                        <tr key={index}>
                            <td>{id}</td>
                            <td>{name}</td>
                            <td>{duration}</td>
                            <td className="text-center">
                                <EditButton to={EDIT_LEAVE_TYPE + id +"/"} />
                            </td>
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