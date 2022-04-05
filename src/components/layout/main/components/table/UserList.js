
import { Name } from "../../../../../utility/Functions";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect } from "react";
import Title from "../../../../forms/title/Title";
import CustomLink from "../../../../forms/customLink/CustomLink";
import axios from "axios";
import "./Table.css";
import { hasPermission } from "../../../../../utility/Permission";
import { ADD_USER, EDIT_USER } from "../../../../../utility/Route";
import EditButton from "../../../../forms/editButton/EditButton";
import { useHistory } from "react-router-dom";
import { getSessionID, getUserType } from "../../../../../utility/Session";
import TableFooter from "./components/TableFooter";


export default function UserList() {

    const endpoint = getHost() + "/api/users/";
    const history = useHistory();

    const canEdit = hasPermission("can_edit_user");

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const isSuperAdmin = getUserType() !== 1 ? false : true;

    const fetchData = async () => {
        const response = await axios.get(endpoint)
        const { data } = await response.data;
        setData(data);
    }

    const fetchEntry = async () => {
        let response = await axios.get(endpoint + "total/")
        let { data } = await response.data;
        setEntry(!isSuperAdmin ? data-=1 : data ); 
    }

    useEffect(() => {
        fetchData(endpoint);
        fetchEntry();
    /* eslint-disable react-hooks/exhaustive-deps */
    },[]) 

    const handleSearchBarChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        fetchData(searchTerm ? endpoint + "search="+searchTerm+"/" : endpoint)
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
                                fontSize="25px"
                                text="Users"
                            />
                            <CustomLink 
                                text="Add User"
                                // permission="can_add_user"
                                to={ADD_USER}
                            />
                            <Button 
                                type="button"
                                icon={view ? "fas fa-th-large" : "fa fa-table"}
                                onClick={() => {
                                    fetchData(endpoint);
                                    setView(view ? false : true);
                                }}
                            />
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={() => fetchData(endpoint)}
                            />
                        </div>
                        <div className="col-right col-lg-6">
                            <SearchBar 
                                value={searchTerm}
                                onChange={handleSearchBarChange}
                            />
                        </div>  
                </div>
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Entries 
                                width="200px"
                                value={data.length}
                                entries={entry}
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
            { id: "employee", name: "employee" },
            { id: "username", name: "username" },
            { id: "email", name: "email" },
            { id: "role", name: "role" },
            { id: "is_active", name: "status" },
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
                    { canEdit && <th className="text-center">action</th> }
                </tr>
            </thead>
        )
    }

    function getActiveStatus(is_active) {
        return is_active? <span className="text-success">Online</span> : <span className="text-danger">Offline</span>
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                
                const { id, username, email, is_active, role } = item;
            
                return (
                        <tr key={id}>
                            <td>{index+=1}</td>
                            <td>{Name(item)}</td>
                            <td>{username}</td>
                            <td>{email}</td>
                            <td>{role.title}</td>
                            <td>{getActiveStatus(is_active)}</td>
                            { canEdit && <td className="text-center">
                                <EditButton 
                                    icon="fa fa-search"
                                    to={EDIT_USER + username + "/"}
                                />
                            </td> }
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

    function renderCard() {
        return data.length === 0 ? <h4 className="loading text-start text-secondary">loading...</h4> : data.map((item, index) => {
            const { image, username, email, is_active } = item;
            return (
                <div key={index} className="User Card"> 
                    <div className="row row-1">
                        <div className="col-lg-12 text-end m-0">
                        {canEdit ? 
                            <i className="fas fa-user-edit" onClick={()=> history.push(EDIT_USER + username +"/" + getSessionID())}></i> : 
                            <div style={{ marginTop: '10px' }}> </div>
                        }
                        </div>
                    </div>
                    <div className="row row-2">
                        <div className="col-lg-4 imageContainer">
                            <img src={getHost() + image} alt="" />
                        </div>
                        <div className="col-lg-8">
                            <p className="username text-decoration-underline"><b>{username}</b></p>
                            <p className="name">{Name(item)}</p>
                            <p>Status: <span className={"active-status "}>{getActiveStatus(is_active)}</span></p>
                        </div>
                    </div> 
                    <div className="row row-3">
                        <div className="col-lg-12">
                            <p><i className="fa fa-envelope"></i> {email ? email : "None"}</p>
                        </div>
                    </div> 
                </div>
            )
        })
    }

    function renderContent (){
        return (
            <div className="content">
                <div className="row">
                    <div className="col-lg-12">            
                        <div className="tableContainer" style={{ maxHeight: window.innerHeight - (window.innerHeight * 0.46)}}>
                            {view ? renderTable() : renderCard()}
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