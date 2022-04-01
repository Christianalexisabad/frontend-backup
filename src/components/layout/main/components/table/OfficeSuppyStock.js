import { getData } from "../../../../../utility/Functions";
import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Button from "../../../../forms/button/Button";
import Title from "../../../../forms/title/Title";
import Download from "../../../../forms/printButton/PrintButton";
import axios from "axios";
import "./Table.css";
import RequestOfficeSupply from "../../../createForm/RequestOfficeSupply";
import TableFooter from "./components/TableFooter";

export default function OfficeSupplyStock(props) {
        
    const endpoint = getHost() + "/api/office-supply-stocks/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [stockID, setStockID] = useState(null);

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data, total } = await response.data;
        setData(data);
        setEntry(total);
    }

    const [Types, setTypes] = useState([]);
    const [Articles, setArticles] = useState([]);
    const [MeasurementUnits, setUnits] = useState([]);

    const fetchTypes = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-types/")
        setTypes(await response.data);
    }

    const fetchArticles = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-articles/")
        setArticles(await response.data);
    }

    const fetchUnits = async () => {
        const response = await axios.get(getHost() + "/api/measurement-units/")
        setUnits(await response.data);
    }

    useEffect(() => {
        fetchTypes();
        fetchArticles();
        fetchUnits();
        fetchData(endpoint);
    /* eslint-disable react-hooks/exhaustive-deps */
    },[])

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
                                text="Available Stocks"
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
        { id: "type", name: "type"},
        { id: "article", name: "article"},
        { id: "description", name: "description"},
        { id: "measurement_unit", name: "measurement unit"},
        { id: "on_hand_per_count", name: "qty"},
    ];

    function renderTableHeader() {

        return (
            <thead>
                <tr>
                    {header.map((item, i) => {
                        return (
                            <th key={i}>{item.name}<i id={item.id} className="fa fa-sort" onClick={handleSort}></i></th>
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
                const { type, article, description, measurement_unit, quantity } = item;
                return (
                    <tr key={index}>
                        <td>{index+=1}</td>
                        <td>{getData(type, "name", Types)}</td>
                        <td>{getData(article, "name", Articles)}</td>
                        <td>{description}</td>
                        <td>{getData(measurement_unit, "name", MeasurementUnits)}</td>
                        <td>{quantity}</td>
                        <td className="text-center">
                            <Button text="Request" onClick={()=> setStockID(item.id)} />
                        </td>
                        
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



    if (stockID) {
        return <RequestOfficeSupply stockID={stockID} onCancel={()=> setStockID(null)} />
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