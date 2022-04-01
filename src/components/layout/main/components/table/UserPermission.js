import CustomLink from "../../../../forms/customLink/CustomLink";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Table.css";
import { hasPermission } from "../../../../../utility/Permission";
import EditButton from "../../../../forms/editButton/EditButton";
import DeleteButton from "../../../../forms/deleteButton/DeleteButton";
import { ADD_USER_PERMISSION, EDIT_USER_PERMISSION } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";

export default function UserPermission(props) {

    const endpoint = getHost() + "/api/user-permissions/";

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const canEdit = hasPermission("can_edit_user_permission");
    const canDelete = hasPermission("can_delete_user_permission");

    const fetchData = async (endpoint) => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(await data);
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
                            <CustomLink 
                                text="Add User Permission"
                                permissions="can_add_user_permission"
                                to={ADD_USER_PERMISSION}
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
            <th id="user__username">User<i className="fa fa-sort" onClick={handleSort}></i></th>
            <th id="permission__description">Permission<i className="fa fa-sort" onClick={handleSort}></i></th>
            {hasPermission("can_edit_permission")? <th className="text-center">action</th> : null}
        </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                    const { id, user, permission } = item;
                    return (
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{user.username}</td>
                            <td>{permission.description}</td>
                            {
                                (canEdit || canDelete) &&
                                <td className="text-center">
                                    <EditButton permission="can_edit_user_permission" to={EDIT_USER_PERMISSION + id +"/"} />
                                    <DeleteButton permission="can_delete_user_permission" from="user-permissions" id={id} name={permission.description} />
                                </td>
                            }
                        </tr>
                    )
                }) : <tr className="text-center"><td>No data to show...</td></tr> } 
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