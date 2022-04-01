import CustomLink from "../../../../forms/customLink/CustomLink";
import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Button from "../../../../forms/button/Button";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import Download from "../../../../forms/printButton/PrintButton";
import EditButton from "../../../../forms/editButton/EditButton";
import { ADD_OFFICE_SUPPLY_TYPE } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function OfficeSupplyTypes(props) {

    const endpoint = getHost() + "/api/office-supply-types/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    
    const fetchData = async (endpoint) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(data);
    }

    const fetchEntry = async () => {
        const response = await axios.get(endpoint +"total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    useEffect(() => {
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
                                text="Office Supply Types"
                            />
                            <CustomLink 
                                text="Add New Type"
                                to={ADD_OFFICE_SUPPLY_TYPE}
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
                    <th>No<i id="id" className="fa fa-sort" onClick={handleSort}></i></th>
                    <th>Name<i id="name" className="fa fa-sort" onClick={handleSort}></i></th>
                    <th className="text-center">action</th>
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                    const { id, name } = item;

                    return (
                        <tr key={index}>
                            <td>{index+=1}</td>
                            <td>{name}</td>
                            <td className="text-center">
                                <EditButton 
                                    to={"/pages/settings/office supply types/edit/" + id + "/"}
                                />
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