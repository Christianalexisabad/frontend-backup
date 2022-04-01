import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { getApprovalStatus, getData } from "../../../../../utility/Functions";
import { getEmployeeID, getRole } from "../../../../../utility/Session";
import ApproveButton from "../../../../forms/approveButton/ApproveButton";
import DeclineButton from "../../../../forms/declineButton/DeclineButton";
import ConfirmDialog from "../../../../forms/confirmDialog/ConfirmDialog";
import AlertMessage from "../../../../forms/alert/AlertMessage";
import TableFooter from "./components/TableFooter";

export default function OfficeSupplyRequest(props) {

    const display = true;

    const ROLE = getRole();
    const HOST = getHost();
    const employee = getEmployeeID();
    const endpoint = getHost() + (ROLE === 4 ? "/api/office-supply-requests/" : "/api/office-supply-requests/"+ employee +"/");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [Stocks, setStocks] = useState([]);
    const [toUpdate, setToUpdate] = useState(null);

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(data);
    }

    const fetchStocks = async () => {
        const response = await axios.get(getHost() + "/api/office-supply-stocks/")
        const { data } = await response.data;
        setStocks(data);
    }

    const fetchEntry = async () => {
        const response = await axios.get(endpoint + "total/")
        const { data } = await response.data;
        setEntry(data); 
    }

    const [Types, setTypes] = useState([]);
      
    const fetchTypes = async() => {
        const response = await axios.get(getHost() + "/api/office-supply-types/");
        let { data } = await response.data;
        setTypes(data);
    }

    const [Articles, setArticles] = useState([]);
      
    const fetchArticles = async() => {
        const response = await axios.get(getHost() + "/api/office-supply-articles/");
        let { data } = await response.data;
        setArticles(data);
    }

    const [Units, setUnits] = useState([]);
      
    const fetchUnits = async() => {
        const response = await axios.get(getHost() + "/api/measurement-units/");
        let { data } = await response.data;
        setUnits(data);
    }

    useEffect(() => {
        fetchStocks();
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
                <div className  ="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Requests" 
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
            { id: "id", name: "request id"},
            { id: "type", name: "type"},
            { id: "article", name: "article"},
            { id: "description", name: "description"},
            { id: "measurement_unit", name: "unit"},
            { id: "quantity", name: "quantity"},
            { id: "is_approved", name: "status"},
        ];

        return (
            <thead>
                <tr>
                    {data.map((item, i) => {
                        return (
                            <th key={i}>{item.name}<i id={item.id} className="fa fa-sort" onClick={handleSort}></i></th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                    const { id, quantity, is_approved, stock } = item;
                    const stock_quantity = getData(stock, "quantity", Stocks); 
                    const type = getData(stock, "type", Stocks); 
                    const article = getData(stock, "article", Stocks); 
                    const description = getData(stock, "description", Stocks); 
                    const measurement_unit = getData(stock, "measurement_unit", Stocks); 

                    return (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{getData(type, "name", Types)}</td>
                            <td>{getData(article, "name", Articles)}</td>
                            <td>{description}</td>
                            <td>{getData(measurement_unit, "name", Units)}</td>
                            <td>{quantity}</td>
                            <td>{getRole() === 4 ? 
                                <span>
                                    {is_approved === 0 ?  
                                        <span>
                                            <ApproveButton 
                                                onClick={() => {
                                                    const isInStock = stock_quantity <= 0 || stock_quantity - quantity < 0 ? false : true;
                                                    setToUpdate({
                                                        method: isInStock ? "update" : "",
                                                        url: HOST + "/api/office-supply-stocks/update-quantity/" + stock + "/",
                                                        message: !isInStock ? "Insuffecient stock, action cannot be perfomed." : "Are you sure you want to approve this request?",
                                                        data: {
                                                            stock: stock_quantity,
                                                            request: quantity,
                                                            id: id
                                                        }
                                                    })
                                                }}  
                                            />
                                            <DeclineButton 
                                                onClick={()=> {
                                                    setToUpdate({
                                                        method: "update",
                                                        url: HOST + "/api/office-supply-requests/decline/" + id + "/",
                                                        message: "Are you sure you want to decline this request?",
                                                        data: {}
                                                    })
                                                }}  
                                            />
                                        </span> : getApprovalStatus(is_approved)
                                    }
                                </span> : getApprovalStatus(is_approved)
                            }</td>
                        </tr>
                    )
                }) : <tr className="text-center text-secondary"><td colSpan="4" >No data to show...</td></tr> } 
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
            <ConfirmDialog data={toUpdate} onCancel={()=> setToUpdate(null)} />
            <AlertMessage message={message} onClose={()=> setMessage("")} />
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