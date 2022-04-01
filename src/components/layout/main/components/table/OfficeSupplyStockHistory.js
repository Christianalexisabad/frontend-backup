import CustomLink from "../../../../forms/customLink/CustomLink";
import { getData } from "../../../../../utility/Functions";
import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Button from "../../../../forms/button/Button";
import EditButton from "../../../../forms/editButton/EditButton";
import PreviewButton from "../../../../forms/previewButton/PreviewButton";
import Title from "../../../../forms/title/Title";
import Download from "../../../../forms/printButton/PrintButton";
import axios from "axios";
import "./Table.css";
import { ADD_OFFICE_SUPPLY, EDIT_OFFICE_SUPPLY } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function OfficeSupplyStockHistory(props) {
        
    const endpoint = getHost() + "/api/office-supplies/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(await data);
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

    const fetchEntry = async () => {
        const response = await axios.get(endpoint + "total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    useEffect(() => {
        fetchTypes();
        fetchArticles();
        fetchUnits();
        fetchData(endpoint);
        fetchEntry();
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
                                text="Stock History"
                            />
                            <CustomLink 
                                text="Add New Stock"
                                permission="can_add_office_supply"
                                to={ADD_OFFICE_SUPPLY}
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
            { id: "stock_number", name: "stock number"},
            { id: "fund_name_code", name: "fund name code"},
            { id: "type", name: "type"},
            { id: "article", name: "article"},
            { id: "description", name: "description"},
            { id: "measurement_unit", name: "measurement unit"},
            { id: "unit_value", name: "unit value"},
            { id: "on_hand_per_count", name: "qty"},
            { id: "total", name: "total"},
            { id: "image", name: "photo"},
            { id: "receipt", name: "reference"},
            { id: "remarks", name: "remarks"},
            { id: "created_at", name: "Date added"},
        ];

        return (
            <thead>
                <tr>
                    {data.map((item, i) => {
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
                const { id, total, type, fund_name_code, stock_number, article, description, unit_value, measurement_unit, on_hand_per_count, remarks, created_at, image, receipt } = item;
                return (
                    <tr key={index}>
                        <td>{stock_number}</td>
                        <td>{fund_name_code}</td>
                        <td>{getData(type, "name", Types)}</td>
                        <td>{getData(article, "name", Articles)}</td>
                        <td>{description}</td>
                        <td>{getData(measurement_unit, "name", MeasurementUnits)}</td>
                        <td>{unit_value}</td>
                        <td>{on_hand_per_count}</td>
                        <td>{total}</td>
                        <td>{remarks}</td>
                        <td>{created_at}</td>
                        <td className="text-center">
                            <PreviewButton 
                                to={receipt}
                            />
                        </td>
                        <td className="text-center">
                            <PreviewButton 
                                to={image}
                            />
                        </td>
                        <td>
                            <EditButton 
                                permission="can_edit_office_supp"
                                to={EDIT_OFFICE_SUPPLY + id + "/"}
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