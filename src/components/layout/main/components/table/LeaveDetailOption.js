import EditButton from "../../../../forms/editButton/EditButton";
import CustomLink from "../../../../forms/customLink/CustomLink";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import { getData } from "../../../../../utility/Functions";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import "./Table.css";
import axios from "axios";
import { ADD_LEAVE_DETAIL_OPTION, EDIT_LEAVE_DETAIL_OPTION } from "../../../../../utility/Route";

export default function LeaveDetailOption(props) {

    const endpoint = getHost() + "/api/leave-detail-options/";
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [LeaveTypes, setLeaveTypes] = useState({});

    const fetchLeaveTypes = async () => {
        let response = await axios.get(getHost() + "/api/leave-types/");
        let { data } = response.data;
        setLeaveTypes(data);
    }

    const fetchData = async (endpoint) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(data);
    }

    const fetchEntry = async () => {
        const response = await axios.get(endpoint + "total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    useEffect(() => {
        fetchLeaveTypes();
        fetchData(endpoint);
        fetchEntry();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

    const handleSearchBarChange = (e) => {
        e.preventDefault();
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
                            text="Leave Detail Options"
                        />
                        <CustomLink 
                            text="Add Leave Detail Option"
                            to={ADD_LEAVE_DETAIL_OPTION}
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

    function renderTableHeader() {

        const header = [
            { id: "id", name: "no" },
            { id: "name", name: "name" },
            { id: "leave_type", name: "leave type" },
        ]

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
                    <th className="text-center">action</th>
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                    const { id, name, leave_type } = item;

                    return (
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{name}</td> 
                            <td>{getData(leave_type, "name", LeaveTypes)}</td>
                            <td className="text-center">
                                <EditButton to={EDIT_LEAVE_DETAIL_OPTION + id +"/"} />
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