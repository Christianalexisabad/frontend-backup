
import { isPath, clean } from "../../../../../utility/Functions";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { USER_ACTIVITIES } from "../../../../../utility/Route";

export default function UserActivity() {
    
    const display = isPath(USER_ACTIVITIES);
    const HOST = getHost();
    const defaultPath ="user-activities/"; 
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("-id");
    const [path, setPath] = useState("");

    const fetchData = async () => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        const { data, total } = await response.data;
        setEntry(total);
        setData(data);
    }

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

    useEffect(() => {
        let newPath = "";

        newPath =  searchTerm ? "search=" + searchTerm + "/" :
                order ? "order=" + order + '/' : "";

        setPath(newPath ? defaultPath + newPath : defaultPath);
    }, [ searchTerm, order ])

    useEffect(() => {
        display && path && fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [display, path])

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="User Activities" 
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

        const data = [
            { id: "id", name: "ID"},
            { id: "user__username", name: "user"},
            { id: "type", name: "type"},
            { id: "action", name: "action"},
            { id: "description", name: "description"},
            { id: "ip_address", name: "IP    Address"},
            { id: "date", name: "date"},
        ];

        return (
            <thead>
                <tr>
                    {data.map((item, index) => {
                        return (
                            <th key={index}>
                                {clean(item.name)}
                                <i id={item.id} className="fa fa-sort" onClick={handleSort} />
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
                    const { id, user, type, action, description, ip_address, date } = item;
                    return (
                        index < entry &&
                        <tr key={index}>
                            <td>{ id }</td>
                            <td>{ user.username }</td>
                            <td>{ type }</td>
                            <td>{ action }</td>
                            <td>{ description }</td>
                            <td>{ ip_address }</td>
                            <td>{ date }</td>
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


    function renderFooter() {
        return (
            <div className="footer">
                <div className="row"> 
                    <div className="col-lg-12">
                        <p>Showing <b>{data.length > 0? 1 : 0 }</b> to <b>{data.length }</b> of <b>{data.length === 0 ? 0 : entry }</b> entries</p>
                    </div>
                </div>
            </div>
        )
    }

    return display? <div className="Table bg-white">
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
    </div> : null
}