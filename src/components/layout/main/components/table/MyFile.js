

import { isPath } from "../../../../../utility/Functions";
import { getHost } from "../../../../../utility/APIService";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import Entries from "../../../../forms/entries/Entries";
import React, { useState, useEffect } from "react";
import Button from "../../../../forms/button/Button";
import Title from "../../../../forms/title/Title";
import axios from "axios";
import "./Table.css";
import { getUsername } from "../../../../../utility/Session";
import DeleteButton from "../../../../forms/deleteButton/DeleteButton";
import PreviewButton from "../../../../forms/previewButton/PreviewButton";
import DownloadButton from "../../../../forms/downloadButton/DownloadButton";
import SubmitButton from "../../../../forms/submitButton/SubmitButton";
import UploadFile from "../../../createForm/UploadFile";
import TableFooter from "./components/TableFooter";

export default function MyFile() {

    const display = isPath("/pages/file/my%20files/")
    const endpoint = getHost() + "/api/my-files/get/"+ getUsername() + "/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpload, setUpload] = useState(false);

    const fetchData = async (endpoint,) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(await data);
    }

    const fetchEntry = async () => {
        const response = await axios.get(endpoint.replace("get", "total"))
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
        fetchData(endpoint + "order="+order+"/")
    }


    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="My Files"
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
                                // value={data.length}
                                entries={entry}
                                onChange={handleEntry}
                            />
                        </div>
                        <div className="col-right col-lg-6">
                            {/* <Download data={data}/> */}
                        </div>  
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "no"},
        { id: "name", name: "name"},
        { id: "comment", name: "description"},
        { id: "type", name: "type"},
        { id: "size", name: "size(KB)"},
        { id: "date_uploaded", name: "date uploaded"},
    ];

    function renderTableHeader() {
        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
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
                
                const { id, name, description ,type, size, path ,date_uploaded } = item;
                return (
                    index < entry &&
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{type}</td>
                            <td>{(size / 1000000) + " MB"}</td>
                            <td>{date_uploaded}</td>
                            <td className="text-center">
                                <DownloadButton toDownload={path} />
                                <PreviewButton to={path} />
                                <DeleteButton from="my-files" id={id} name={name} onCancel={()=> fetchData(endpoint)} />
                            </td>
                        </tr>
                )
            }) : <tr className="text-center text-secondary"><td colSpan={header.length + 1}>No data to show...</td></tr> } 
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
        return display && <UploadFile to={"my-files"}  onCancel={() => setUpload(false)} />
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