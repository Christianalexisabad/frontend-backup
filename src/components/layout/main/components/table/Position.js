import CustomLink from "../../../../forms/customLink/CustomLink";
import { hasPermission } from "../../../../../utility/Permission";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import { isPath } from "../../../../../utility/Functions";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import "./Table.css";
import axios from "axios";
import { ADD_POSITION, EDIT_POSITION, POSITIONS } from "../../../../../utility/Route";
import EditButton from "../../../../forms/editButton/EditButton";
import TableFooter from "./components/TableFooter";

export default function Position() {

    const display = isPath(POSITIONS);
    const endpoint = getHost() + "/api/positions/";
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const canEdit = hasPermission("can_edit_position");

    const fetchData = async (endpoint) => {
        const response = await axios.get(endpoint)
        const { total, data } = await response.data;
        setData(data);
        setEntry(total);
    }
    
    useEffect(() => {
        if (display) {
            fetchData(endpoint);
        }
    }, [ display, endpoint ])

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
                                text="Positions"
                            />
                            <CustomLink 
                                text="Add Position"
                                // permission="can_add_position"
                                to={ADD_POSITION}
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
        { id: "id", name: "no" },
        { id: "title", name: "title" },
        { id: "department", name: "department" },
        { id: "status", name: "status" }
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
                    {canEdit && <th className="text-center">action</th>}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                    const { id, title, department, is_vacant } = item;

                    return (
                        <tr key={index}>
                            <td>{index+=1}</td>
                            <td>{title}</td>
                            <td>{department.name}</td>
                            <td>
                                { is_vacant ? <span className="text-success">Hiring</span> : 
                                <span className="text-danger">No Hiring</span> }
                            </td>
                            <td><EditButton to={EDIT_POSITION + id +"/"} /></td>
                            {canEdit && <td className="text-center">
                                
                            </td>}
                        </tr>
                    )
                }) : <tr className="text-center text-secondary"><td colSpan={header.length}>No data to show...</td></tr> } 
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