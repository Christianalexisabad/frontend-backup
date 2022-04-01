import { hasPermission } from "../../../../../utility/Permission";
import { Name, isPath, getValue, getLocation} from "../../../../../utility/Functions";
import { getSessionID } from "../../../../../utility/Session";
import CustomLink from "../../../../forms/customLink/CustomLink";
import EditButton from "../../../../forms/editButton/EditButton";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Download from "../../../../forms/printButton/PrintButton";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect, useCallback } from "react";
import Title from "../../../../forms/title/Title";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Table.css";
import { ADD_DEPARTMENT, DEPARTMENTS, EDIT_DEPARTMENT } from "../../../../../utility/Route";
import TableFooter from "./components/TableFooter";
import * as styles from "../../../../../utility/Styles";

export default function DepartmentList(props) {

    const display = isPath(DEPARTMENTS);
    const HOST = getHost();
    const defaultPath = "departments/";
    const canEdit = hasPermission('can_edit_department');

    const [data, setData] = useState([]);
    const [entry, setEntry] = useState(0);
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("-id");

    const fetchData = useCallback(async (path) => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        const { total, data } = await response.data;
        setEntry(total);
        setData(data);
    }, [ HOST ])

    useEffect(() => {
        if (display) {
            let newPath = "";
            newPath = newPath ? defaultPath + newPath : defaultPath;
            fetchData(newPath + (order ? "order=" + order + "/" : ""));
        }
    },[ display, defaultPath, fetchData, order ]);   

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
        setOrder(order);
    }

    function renderHeader() {
        return (
            <div className="header">
                <div className="row">
                        <div className="col-left col-lg-6">
                            <Title  
                                text="Departments"
                            />
                            <CustomLink 
                                text="Add Department"
                                permission="can_add_department"
                                to={ADD_DEPARTMENT}
                            />
                            <Button 
                                icon={view ? "fas fa-th-large" : "fa fa-table"}
                                onClick={() => {
                                    fetchData(defaultPath);
                                    setView(view ? false : true);
                                }}
                            />
                            <Button 
                                icon="fa fa-refresh"
                                onClick={ () => {
                                    setSearchTerm("");
                                    fetchData(defaultPath);
                                }}
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
        { id: "id", name: "ID"},
        { id: "name", name: "name"},
        { id: "department_head_id", name: "department head"},
        { id: "location", name: "location"},
        { id: "tel_no", name: "tel no"},
        { id: "email", name: "email"}
    ];

    function renderTableHeader() {

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
                    {canEdit && <th className="text-center">Action</th>}
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {
                   
                   let { id, name, department_head, location, email, tel_no } = item;

                    department_head = department_head && Name(department_head);
                    location = getLocation(location);
                    tel_no = tel_no === undefined ? "" : tel_no;
                    email = email === undefined ? "" : email;

                   return (
                        index < entry &&
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{name}</td>
                            <td>{department_head}</td>
                            <td>{location}</td>
                            <td>{tel_no}</td>
                            <td>{email}</td>
                            {canEdit && <td className="text-center">
                                <EditButton 
                                    to={"/pages/department/departments/edit/" + id +"/"} 
                                />
                            </td>}
                        </tr>
                    )
                }) : <tr className="text-center text-secondary"><td colSpan={header.length} >No data to show...</td></tr> } 
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
        
        return data.length > 0 && data.map((item, index) => {  

            const { id, image, name ,email, tel_no, location, department_head } = item;
            const imageURL = getHost() + image;

            return (
                index < entry &&
                <div key={ id } className="Card"> 
                    <div className="row row-1">
                        <div className="col-lg-12 text-end m-0">
                            {true ?
                                <Link 
                                    className="edit text-dark"
                                    to={ EDIT_DEPARTMENT + id +"/" + getSessionID() }
                                >
                                    <i className="fa fa-eye"></i>
                                </Link> : <div style={{ marginTop: "10px"}}></div>
                            }
                        </div>
                    </div>
                    <div className="row row-2">
                        <div className="col-lg-4 imageContainer">
                            <img className="department" src={ imageURL } alt="" />
                        </div>
                        <div className="col-lg-8">
                            <p className="id">
                                <b>Department ID: </b>
                                <span>{ id }</span>
                            </p>
                            <p className="name">
                                <b>Name: </b>
                                <span>{ name }</span>
                            </p>
                            <p className="department head" title="Department Head">
                                <b>Department Head: </b>
                                { Name(department_head) }
                            </p>
                            <p className="location" title="Location">
                                <i className="fa fa-map-marker text-danger"></i>
                                <span>{ getLocation(location) }</span>
                            </p>
                        </div>
                    </div> 
                    <div className="row row-3">
                        <div className="col-lg-12">
                            <p><i className="fa fa-phone"></i>{ getValue(tel_no) }</p>
                            <p><i className="fa fa-envelope"></i>{ getValue(email) }</p>
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
                        <div className="tableContainer" style={styles.tableContainer}>
                            {view ? renderTable() : renderCard()}
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