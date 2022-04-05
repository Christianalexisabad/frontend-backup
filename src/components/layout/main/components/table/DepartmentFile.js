import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import { isPath } from "../../../../../utility/Functions";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import PreviewButton from "../../../../forms/previewButton/PreviewButton";
import DeleteButton from "../../../../forms/deleteButton/DeleteButton";
import SubmitButton from "../../../../forms/submitButton/SubmitButton";
import UploadFile from "../../../createForm/UploadFile";
import DownloadButton from "../../../../forms/downloadButton/DownloadButton";
import TableFooter from "./components/TableFooter";

export default function DepartmentFile() {

    const display = isPath("/pages/file/department%20files/")
    const endpoint = getHost() + "/api/department-files/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [isUpload, setUpload] = useState(false);
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
                                text="Department Files"
                            />
                            <SubmitButton
                                text="Add New File"
                                onClick={()=> setUpload(true)}
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
                    </div>  
                </div>
            </div>
        )
    }

    function renderTableHeader() {

        const data = [
            { id: "id", name: "no"},
            { id: "name", name: "name"},
            { id: "description", name: "description"},
            { id: "type", name: "type"},
            { id: "size", name: "size(KB)"},
            { id: "date_uploaded", name: "date uploaded"},
        ];

        return (
            <thead>
                <tr>
                    {data.map((item, index) => {
                        return <th key={index}>{item.name}<i id={item.id} className="fa fa-sort" onClick={handleSort}></i></th>
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

                const { id, name, description, path, type, size, date_uploaded } = item;

                return (
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{type}</td>
                            <td>{size}</td>
                            <td>{date_uploaded}</td>
                            <td className="text-center">
                                <DownloadButton toDownload={path} />
                                <PreviewButton to={path} />
                                <DeleteButton from="department-files" id={id} name={name} onCancel={()=> fetchData(endpoint)} />
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


    
    if (isUpload) {
        return display && <UploadFile to={"department-files"}  onCancel={() => setUpload(false)} />
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