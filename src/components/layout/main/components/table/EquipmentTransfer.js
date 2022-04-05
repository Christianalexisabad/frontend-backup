import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Button from "../../../../forms/button/Button";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { hasPermission } from "../../../../../utility/Permission";
import TableFooter from "./components/TableFooter";

export default function ReleasedEquipment(props) {

    const display = true;
    const endpoint = getHost() + "/api/released-items/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    // search bar
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(await data);
    }

    const fetchEntry = async () => {
        const response = await axios.get(endpoint + "total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    useEffect(() => {
        if (display) {
            fetchData(endpoint);
            fetchEntry();
        }
    /* eslint-disable react-hooks/exhaustive-deps */
    },[display])

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
                                text="Transfer History" 
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
        return (
            <thead>
                <tr>
                    <th>No</th>   
                    <th id="employee">Employee<i className="fa fa-sort" onClick={handleSort}></i></th>     
                    <th id="task">Task<i className="fa fa-sort" onClick={handleSort}></i></th>     
                    <th id="start_date">Start_date<i className="fa fa-sort" onClick={handleSort}></i></th>     
                    <th id="end_date">End_date<i className="fa fa-sort" onClick={handleSort}></i></th>     
                    {hasPermission("can_edit_task")? <th className="text-center">action</th> : null}
                </tr>
            </thead>
        )
    }


    function renderTableBody() {
        try{
            return data.map((item, index) => {
                return (
                    <tr>
                        <td>{index+=1}</td>
                        <td>{item.type.name}</td>
                        <td>{item.fund_name_code}</td>
                        <td>{item.article.name}</td>
                        <td>{item.description}</td>
                        <td>{item.property_number}</td>
                        <td>{item.cost}</td>
                        <td>{item.location}</td>
                        <td>{item.condition}</td>
                        <td>{item.remarks}</td>
                    </tr>
                )
            })
        }catch (e)
        {
        }
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