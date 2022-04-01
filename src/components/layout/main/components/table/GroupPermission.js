import SearchBar from "../../../../forms/searchBar/SearchBar";
import { deleteData, getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import CustomLink from "../../../../forms/customLink/CustomLink";
import axios from "axios";
import "./Table.css";
import { hasPermission } from "../../../../../utility/Permission";
import DeleteButton from "../../../../forms/deleteButton/DeleteButton";
import EditButton from "../../../../forms/editButton/EditButton";
import { ADD_GROUP_PERMISSION, EDIT_GROUP_PERMISSION } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function GroupPermission(props) {

    const endpoint = getHost() + "/api/group-permissions/";
    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const canEdit = hasPermission("can_edit_group_permission");
    const canDelete = hasPermission("can_delete_group_permission");

    const fetchData = async (endpoint) => {
        const response = await axios.get(endpoint)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }

    useEffect(() => {
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
        fetchData(endpoint + "entry="+e.target.value+"/")
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
                            <CustomLink 
                                text="Add Group Permission"
                                permission="can_edit_user"
                                to={ADD_GROUP_PERMISSION}
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
            { id: "group__name", name: "group" },
            { id: "permission__description", name: "permission" },
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
                    {hasPermission("can_edit_permission")? <th className="text-center">action</th> : null}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    const { id, group, permission } = item;
                    return (
                        <tr key={index}>
                           <td>{index+=1}</td>
                            <td>{group.name}</td>
                            <td>{permission.description}</td>
                            {
                                (canEdit || canDelete ) && 
                                <td className="text-center">
                                    <EditButton 
                                        permission="can_edit_group_permission" 
                                        to={EDIT_GROUP_PERMISSION + id +"/"} 
                                    />
                                    <DeleteButton 
                                        onClick={()=> deleteData('group-permissions', id)}
                                    />
                                </td>
                            }
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