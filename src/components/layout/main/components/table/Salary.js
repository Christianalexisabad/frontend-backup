


import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import CustomLink from "../../../../forms/customLink/CustomLink";
import axios from "axios";
import EditButton from "../../../../forms/editButton/EditButton";
import Button from "../../../../forms/button/Button";
import "./Table.css";
import { ADD_SALARY, EDIT_SALARY } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function Salary() {

    const display = true;
    const endpoint = getHost() + "/api/salaries/";

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
                                text="Salaries"
                            />
                            <CustomLink 
                                text="Add Salary"
                                // permission="can_add_position"
                                to={ADD_SALARY}
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

        const data = [
            { id: "id", name: "no"},
            { id: "pay_grade", name: "pay grade/step"},
            { id: "amount", name: "amount"},
        ];

        return (
            <thead>
                <tr>
                    {data.map((item, index) => {
                        return (
                            <th key={index}>
                                <span>{item.name}</span>
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
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

                    const { id, pay_grade, amount } = item;

                    return (
                        <tr key={index}>
                            <td>{ id }</td>
                            <td>{ pay_grade.replace("-", "/") }</td>
                            <td>{ amount }</td>
                            <td className="text-center">
                                <EditButton to={EDIT_SALARY + id +"/"} />
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