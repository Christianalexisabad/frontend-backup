import { hasPermission } from "../../../../../utility/Permission";
import CustomLink from "../../../../forms/customLink/CustomLink";
import { Name, isPath, getEmployeeStatus, getData } from "../../../../../utility/Functions";
import { getSessionID } from "../../../../../utility/Session";
import SearchBar from "../../../../forms/searchBar/SearchBar";
import { getHost } from "../../../../../utility/APIService";
import Entries from "../../../../forms/entries/Entries";
import Button from "../../../../forms/button/Button";
import React, { useState, useEffect, useCallback } from "react";
import Title from "../../../../forms/title/Title";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Table.css";
import { ADD_EMPLOYEE, EDIT_EMPLOYEE } from "../../../../../utility/Route";
import EditButton from "../../../../forms/editButton/EditButton";
import EmployeeFilter from "../../../../forms/employeeFilter/EmployeeFilter";
import PrintButton from "../../../../forms/printButton/PrintButton";
import TableFooter from "./components/TableFooter";

const initialData = {
    filterValue: "", 
    department: "", 
    employee_type: "",
    employee_status: "",
    sex: "",
    birthplace: "",
    birthdate: "",
    age: "",
    height: "",
    weight: "",
    endDate: "",
}

export default function EmployeeList() {
    
    const display = isPath("/pages/employee/employees/");
    const HOST = getHost();
    const defaultPath = "employees/";

    const history = useHistory();
    const [data, setData] = useState("");
    const [entry, setEntry] = useState(0);
    const [view, setView] = useState(false);
    const [order, setOrder] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [EmployeeStatuses, setEmployeeStatuses] = useState([]);

    const canReadEmployeeContact = hasPermission('can_read_employee_contact');
    const canEditEmployee = hasPermission('can_edit_employee');

    const styles = {
        contact: {
            display: canReadEmployeeContact ? 'auto' : 'none'
        },
        action: {
            display: canEditEmployee ? 'auto' : 'none'
        }
    }

    const fetchEmployeeStatuses = useCallback(async () => {
        const response = await axios.get(HOST + "/api/employee-statuses/");
        const { data } = await response.data;
        setEmployeeStatuses(data);
      }, [ HOST ]);

    const canEdit = hasPermission("can_edit_employee");
    const canDelete = hasPermission("can_delete_employee");

    const [filterData, setFilterData] = useState(initialData);

    const handleFilterChange = (e) => {
        e.preventDefault();
        setSearchTerm("");
        setFilterData({ ...filterData, [e.target.id]: e.target.value })
    }

    let {
        department, 
        employee_type,
        employee_status,
        sex,
        birthplace,
        birthdate,
        age,
        height,
        weight,
        startDate,
        endDate
    } = filterData;


    const fetchData = useCallback(async(path) => {
        const apiURL = HOST + "/api/" + path;
        const response = await axios.get(apiURL)
        let { data, total } = await response.data;
        setEntry(total);
        setData(data);
     }, [ HOST ]);


    useEffect(() => {

        let newPath = "";
        let dept = parseInt(department);

        let date_hired_range = startDate + ":" + endDate;

        if (!searchTerm) {
        newPath = dept && employee_type && employee_status && sex && startDate && endDate && order? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status  + "/sex=" + sex + "/date_hired_range=" + date_hired_range + "/order=" + order + "/":
                dept && employee_type && employee_status && sex && startDate && endDate ? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status  + "/sex=" + sex + "/date_hired_range=" + date_hired_range + "/":
                dept && employee_type && employee_status && sex && order? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status + "/sex=" + sex + "/order=" + order + "/":
                dept && employee_type && employee_status && sex ? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status + "/sex=" + sex + "/":
                dept && employee_type && employee_status && order? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status + "/":
                dept && employee_type && employee_status ? "department=" + dept + "/employee_type=" + employee_type + "/employee_status=" + employee_status + "/":
                dept && employee_type && order ? "department=" + dept + "/employee_type=" + employee_type + "/":
                dept && employee_type ? "department=" + dept + "/employee_type=" + employee_type + "/" :
                dept && employee_status && sex && order ? "department=" + dept + "/employee_status=" + employee_status + "/sex=" + sex + "/order=" + order + "/":
                dept && employee_status && sex ? "department=" + dept + "/employee_status=" + employee_status + "/sex=" + sex + "/":
                dept && employee_status && order ? "department=" + dept + "/employee_status=" + employee_status + "/order=" + order + "/":
                dept && employee_status ? "department=" + dept + "/employee_status=" + employee_status + "/":
                dept && sex && order? "department=" + dept + "/sex=" + sex + "/order=" + order + "/": 
                dept && sex ? "department=" + dept + "/sex=" + sex + "/" : 
                dept && startDate && endDate ? "department=" + dept + "/date_hired_range=" + date_hired_range + "/" : 
                dept ? "department=" + dept + "/" : 
                employee_type && sex ? "employee_type=" + employee_type + "/sex=" + sex + "/" : 
                employee_type ? "employee_type=" + employee_type + "/" :
                employee_status && sex ? "employee_status=" + employee_status + "/sex=" + sex + "/": 
                employee_status && sex ? "employee_status=" + employee_status + "/sex=" + sex + "/": 
                employee_status ? "employee_status=" + employee_status + "/" : 
                sex ? "sex=" + sex + "/" :
                startDate && endDate ? "date_hired_range=" + date_hired_range + "/" : "";
        } else {
            setFilterData(initialData)
            newPath = "search=" + searchTerm + "/";
        }

        newPath = newPath ? defaultPath + newPath : defaultPath;
        fetchData(newPath + (order ? "order=" + order + "/" : ""));

    }, [
        fetchData,
        department, 
        employee_type,
        employee_status,
        sex,
        birthplace,
        birthdate,
        age,
        height,
        weight,
        startDate,
        endDate,
        order,
        searchTerm
    ]);

    useEffect(() => {
        fetchEmployeeStatuses();
    }, [ fetchEmployeeStatuses ]);

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
                                text="Employees"
                            />
                            <CustomLink 
                                text="Add Employee"
                                permission="can_add_employee"
                                to={ADD_EMPLOYEE}
                            />
                            <Button 
                                type="button"
                                icon={view ? "fas fa-th-large" : "fa fa-table"}
                                onClick={
                                    () => setView(view ? false : true)
                                }
                            />
                            <Button 
                                type="button"
                                icon="fa fa-refresh"
                                onClick={()=> {
                                    setFilterData(initialData);
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
                        <PrintButton 
                            table="employee"
                            title="Employee List"
                            from={startDate}
                            to={endDate}
                            header={header} 
                            data={data} 
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-left col-lg-12">
                        <EmployeeFilter 
                            data={filterData}
                            onChange={handleFilterChange}
                            onCancel={()=> setFilterData(initialData)}                                
                        />
                    </div>
                </div>
            </div>
        )
    }

    const header = [
        { id: "id", name: "No", display: true },
        { id: "employee_no", name: "Employee No", display: true },
        { id: "name", name: "Name", display: true },
        { id: "position__title", name: "Position", display: true },
        { id: "position__department__name", name: "Department", display: true },
        { id: "mobile_no", name: "mobile no", display: canReadEmployeeContact },
        { id: "tel_no", name: "tel no", display: canReadEmployeeContact },
        { id: "email", name: "email", display: canReadEmployeeContact },
    ];

    function renderTableHeader() {
        return (
            <thead>
                <tr>
                    {header.map((item, index) => {
                        return (
                            item.display &&
                            <th key={index}>
                                <span>{item.name}</span>
                                <i id={item.id} className="fa fa-sort" onClick={handleSort}></i>
                            </th>
                        ) 
                    })}
                    { (canEdit || canDelete) && <th className="text-center">Action</th> }
                </tr>
            </thead>
        )
    }

    function renderTableBody() {
        return (
            <tbody>
                {data.length > 0 ? data.map((item, index) => {

                const { id, employee_no, position, mobile_no, tel_no, email } = item;
                const name = Name(item);
                const { department, title } = position;

                return (
                    index < entry &&
                    <tr key={id}>
                        <td>{index+=1}</td>
                        <td>{employee_no}</td>
                        <td>{name}</td>
                        <td>{department.name}</td>
                        <td>{title}</td>
                        <td style={styles.contact}>{mobile_no}</td>
                        <td style={styles.contact}>{tel_no}</td>
                        <td style={styles.contact}>{email}</td>
                        <td style={styles.action} className="text-center">
                            <EditButton 
                                permission="can_edit_employee" 
                                to={"/pages/employee/employees/edit/" + employee_no +"/"} 
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

    function renderCard() {
        return data.length > 0 ? data.map((item, index) => {  

            let { id, image, employee_no, position, email, tel_no, mobile_no, sex } = item;
            image = HOST + image;
            const isMale = sex === 1 ? true : false; 

            return (
                index < entry &&
                <div key={id} className="Card"> 
                    <div className="row row-1">
                        <div className="col-lg-12 text-end m-0">
                            <i 
                                className={(isMale ? "fa fa-male" : "fa fa-female") + " sex"} 
                                style={{ color: isMale ? 'blue' : 'pink' }}
                            />
                            { true ? 
                                <i 
                                    className="fa fa-eye" 
                                    onClick={()=> history.push(EDIT_EMPLOYEE + id +"/basic information/" + getSessionID())} /> : 
                                <div style={{ marginTop: '10px' }}> </div>
                            }
                        </div>
                    </div>
                    <div className="row row-2">
                        <div className="col-lg-4 imageContainer">
                            <img src={image} alt="" />
                            <div className="text-center">
                                <span>{getEmployeeStatus(getData(item.employee_status, "name", EmployeeStatuses))}</span>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <p className="employee_no" title="Employee No"><i className="fa fa-id-card"></i> <b>{employee_no}</b> </p>
                            <p className="name" title="Name"><b>Name: </b>{Name(item)}</p>
                            <p className="position" title="Position"><i className="fas fa-briefcase"></i> {position.title}</p>
                            <p className="department" title="Department"><i className="fa fa-building"></i> {position.department.name}</p>
                            <p className="department-head" title="Department Head"><i className="fas fa-user-cog"></i> {Name(position.department.department_head)}</p>
                        </div>
                    </div> 
                    { canReadEmployeeContact &&
                        <div className="row row-3">
                            <div className="col-lg-12">
                                <p><i className="fas fa-mobile-alt"></i>{tel_no ? tel_no : "None"}</p>
                                <p><i className="fa fa-phone"></i>{mobile_no ? mobile_no : "None"}</p>
                                <p><i className="fa fa-envelope"></i> {email ? email : "None"}</p>
                            </div>
                        </div> 
                    }
                 </div>
             )
         }) : <div>
            <h4>Loading...</h4>
        </div>
    }

    function renderContent (){
        return (
            <div className="content">
                <div className="row">
                    <div className="col-lg-12">            
                        <div className="tableContainer"  style={{maxHeight: window.innerHeight - (window.innerHeight * 0.42) }}>
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