import { ADD_CITY, ADD_CIVIL_STATUS, ADD_DEPARTMENT, ADD_EMPLOYEE, ADD_EMPLOYEE_TYPE, ADD_GROUP, ADD_NAME_EXTENSION, ADD_POSITION, ADD_ROLE } from "../../../utility/Route";
import { isName, isPassword, isValidEmployeeNo } from "../../../utility/Regex";
import { createJobHistory, createUserAcitivity, getHost, updateJobStatus } from "../../../utility/APIService";
import { getAge, getCurrentDate, getDateTime, getEndDate} from "../../../utility/DateTime";
import { getData, hasChanges, isPath } from "../../../utility/Functions";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { getUserID } from "../../../utility/Session";
import DialogBox from "../../forms/dialogBox/DialogBox";
import React, { useCallback, useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import Button from "../../forms/button/Button";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";

const initialValues = {
    sur_name: "", 
    first_name: "", 
    middle_name: "", 
    name_extension: null, 
    sex: "", 
    birthdate: "", 
    birthplace: null, 
    age: null,
    civil_status: null, 
    email: "", 
    employee_no: "", 
    employee_type: null, 
    department: "", 
    user: null,
    user_type: null,
    role: null, 
    group: null,
    username: "",
    password: "",
    departmentName: "",
    department_head: null,
    start_date: "", 
    end_date: "", 
    position: null, 
    salary: null,
    payGrade: "",
    date_hired: "",
};

const AddEmployee = () => {  

    const display = isPath(ADD_EMPLOYEE);
    const history = useHistory();
    const currentDate = getCurrentDate();

    const HOST = getHost();
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [data, setData] = useState(initialValues);
    const [prevData, setPrevData] = useState({});

    let {
        sur_name, 
        first_name, 
        middle_name, 
        name_extension, 
        sex, 
        birthdate, 
        age,
        birthplace, 
        email, 
        employee_no, 
        employee_type, 
        department, 
        departmentHead,
        position, 
        start_date, 
        end_date, 
        civil_status,
        salary,
        date_hired,
        role,
        user_type,
        group,
        username,
        password,
    } = data;

    const [EmployeeNo, setEmployeeNo] = useState("");

    const [EmployeeTypes, setEmployeeTypes] = useState([]);
    const [Employees, setEmployees] = useState([]);
    const [Cities, setCities] = useState([]);
    const [NameExtensions, setNameExtensions] = useState([]);
    const [CivilStatuses, setCivilStatuses] = useState([]);
    const [Sexes, setSexes] = useState([]);
    const [Departments, setDepartments] = useState([]);
    const [Positions, setPositions] = useState([]);
    const [Salaries, setSalaries] = useState([]);
    const [UserTypes, setUserTypes] = useState([]);
    const [Roles, setRoles] = useState([]);
    const [Groups, setGroups] = useState([]);

    const [probationaryPeriod, setProbationaryPeriod] = useState([]);
    const [isWithEndDate, setIsWithEndDate] = useState(false);
    const [tab, setTab] = useState(0);

    const fetchEmployeeNo = async () => {
        const response = await axios.get(getHost() + "/api/employees/generate-no/")
        const { data } = await response.data;
        setEmployeeNo(data);
    }

    const fetchDepartments = async () => {
        const response = await axios.get(getHost() + "/api/departments/")
        const { data } = await response.data;
        setDepartments(data);
    }

    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/names/")
        const { data } = await response.data;
        setEmployees(data);
    }

    const fetchSalaries = async () => {
        const response = await axios.get(getHost() + "/api/salaries/")
        const { data } = await response.data;
        setSalaries(data);
    }

    const fetchPositions = useCallback(async () => {
        const response = await axios.get(getHost() + "/api/positions/vacant/"+ department +"/")
        const { data } = await response.data;
        setPositions(data);
    }, [ department ])

    const fetchEmployeeTypes = async () => {
        const response = await axios.get(getHost() + "/api/employee-types/")
        const { data } = await response.data;
        setEmployeeTypes(data)
    }

    const fetchNameExtensions = async () => {
        const response = await axios.get(getHost() + "/api/name-extensions/")
        const { data } = await response.data;
        setNameExtensions(data)
    }
    
    const fetchCities = async () => {
        const response = await axios.get(getHost() + "/api/cities/")
        const { data } = await response.data;

        let cities = [];

        for (const item of data) {
            cities.push({
                id: item.id,
                value: item.zip_code + ", " + item.name
            })
        }

        setCities(cities)
    }

    const fetchCivilStatuses = async () => {
        const response = await axios.get(getHost() + "/api/civil-statuses/")
        const { data } = await response.data;
        setCivilStatuses(data)
    }

    const fetchUserTypes = async () => {
        const response = await axios.get(getHost() + "/api/user-types/")
        const { data } = await response.data;
        setUserTypes(data)
    }

    const fetchRoles = async () => {
        const response = await axios.get(getHost() + "/api/roles/")
        const { data } = await response.data;
        setRoles(data)
    }

    const fetchGroups = async () => {
        const response = await axios.get(getHost() + "/api/groups/")
        const { data } = await response.data;
        setGroups(data)
    }

    const fetchSexes = async () => {
        const response = await axios.get(getHost() + "/api/sexes/")
        const { data } = await response.data;
        setSexes(data)
    }

    function setDialogMessage(message, success) {
        setMessage(message);
        setSuccess(success ? success : false);
    }

    useEffect(() => {
        if (display) {
            setMessage("");
            fetchEmployees();
            fetchEmployeeNo();
            fetchEmployeeTypes();
            fetchCivilStatuses();
            fetchNameExtensions();
            fetchDepartments();
            fetchCities();
            fetchSalaries();
            fetchUserTypes();
            fetchRoles();
            fetchGroups();
            fetchSexes();
        } 
    }, [display]);

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;
        setData({ ...data, [id]: value });

    }

    useEffect(() => {
     
        if (prevData.employee_type !== employee_type) {

            setPrevData({...prevData, employee_type: employee_type});

            const employeeType = parseInt(employee_type);
            const isAutoGenerated = getData(employeeType, "is_auto_generate_no", EmployeeTypes);

            setProbationaryPeriod(getData(employeeType, "period", EmployeeTypes))
            setIsWithEndDate(getData(employeeType, "is_with_end_date", EmployeeTypes));
        
            setData({ ...data,
                employee_no: isAutoGenerated ? EmployeeNo : ""
            })
        }

        if (prevData.birthdate !== birthdate) {
            const age = getAge(birthdate);
            setPrevData({ ...prevData, birthdate: birthdate});
            setData({ ...data, age: age })
        } 

        if (prevData.department !== department) {

            const departmentHead = getData(parseInt(department), "department_head_id", Departments)

            setData({ ...data,
                departmentHead: departmentHead ? departmentHead : ""
            })

            fetchPositions();
            setPrevData({ ...prevData, department: department});
        }

        if (prevData.position !== position) {
            setData({ ...data,
                salary: getData(parseInt(position), "salary", Positions)
            });
            setPrevData({ ...prevData, position: position });
        } 

        try {
            const newEndDate = getEndDate(start_date, probationaryPeriod);
            if (probationaryPeriod && start_date && (newEndDate !== end_date)) {
                setData({ 
                    ...data, 
                    end_date: newEndDate
                });
            }
            else if (end_date && end_date <= start_date) {
                setData({
                    ...data,
                    end_date: ""
                })
            } 
       } catch (error) {
        //    console.log(error);
       }

     
    }, [ 
        data,
        prevData,
        employee_type, 
        birthdate,
        department,
        position,
        start_date,
        end_date,
        probationaryPeriod,
        prevData.employee_type, 
        prevData.birthdate,
        prevData.department,
        prevData.position,
        EmployeeNo, 
        EmployeeTypes,
        Departments,
        Positions,
        fetchPositions,  
    ])

    // error message
    const [err, setErr] = useState({});

    useEffect(() => {

        let error = !employee_type ? "Required" : "";

        if (error !== err.employee_type) {
            setErr({ ...err, employee_type: error });
        }

    }, [ err, err.employee_type, employee_type ]);

    useEffect(() => {

        let error = !employee_no ? "Required" : "";
        
        if (!isValidEmployeeNo(employee_no)) {
            error = "Invalid format"
        }

        if (error !== err.employee_no) {
            setErr({ ...err, employee_no: error });
        } 

    }, [ err, err.employee_no, employee_no ]);

    useEffect(() => {

        let error = "";

        if (!sur_name) {
            error = "Required"
        } 
        
        if (sur_name && !isName(sur_name)) {
            error = "Contains invalid characters."
        }

        if (error !== err.sur_name) {
            setErr({ ...err, sur_name: error });
        }

    }, [ err, err.sur_name, sur_name ]);

    useEffect(() => {

        let error = "";

        if (!first_name) {
            error = "Required"
        }
        
        if (first_name && !isName(first_name)) {
            error = "Contains invalid characters."
        }

        if (error !== err.first_name) {
            setErr({ ...err, first_name: error });
        }

    }, [ err, err.first_name, first_name ]);

    useEffect(() => {

        let error = "";

        if (middle_name && !isName(middle_name)) {
            error = "Contains invalid characters."
        }

        if (error !== err.middle_name) {
            setErr({ ...err, middle_name: error });
        }

    }, [ err, err.middle_name, middle_name ]);

    useEffect(() => {

        let error = !sex ? "Required" : "";

        if (error !== err.sex) {
            setErr({ ...err, sex: error });
        }

    }, [ err, err.sex, sex ]);

    useEffect(() => {

        let error = !civil_status ? "Required" : "";
        
        if (error !== err.civil_status) {
            setErr({ ...err, civil_status: error });
        }

    }, [ err, err.civil_status, civil_status ]);

    useEffect(() => {

        let error = !birthdate ? "Required" : "";

        if (age < 18 || age > 60) {
            error = "Age must be between 18 and 60 years old"
        }

        if (error !== err.birthdate) {
            setErr({ ...err, birthdate: error });
        }

    }, [ err, err.birthdate, birthdate, age ]);

    useEffect(() => {

        let error = !birthplace ? "Required" : "";
        
        if (error !== err.birthplace) {
            setErr({ ...err, birthplace: error });
        }

    }, [ err, err.birthplace, birthplace ]);

    useEffect(() => {

        let error = !department ? "Required" : "";
        
        if (error !== err.department) {
            setErr({ ...err, department: error });
        }

    }, [ err, err.department, department ]);

    useEffect(() => {

        let error = !employee_no ? "Required" : "";
        
        if (error !== err.employee_no) {
            setErr({ ...err, employee_no: error });
        }

    }, [ err, err.employee_no, employee_no ]);
    
    useEffect(() => {

        let error = !position ? "Required" : "";
        
        if (error !== err.position) {
            setErr({ ...err, position: error });
        }

    }, [ err, err.position, position ]);

    useEffect(() => {

        let error = !start_date ? "Required" : "";
        
        if (error !== err.start_date) {
            setErr({ ...err, start_date: error });
        }

    }, [ err, err.start_date, start_date ]);

    useEffect(() => {

        let error = !end_date ? "Required" : "";
        
        if (error !== err.end_date) {
            setErr({ ...err, end_date: error });
        }

    }, [ err, err.end_date, end_date ]);

    useEffect(() => {

        let error = !user_type ? "Required" : "";
        
        if (error !== err.user_type) {
            setErr({ ...err, user_type: error });
        }

    }, [ err, err.user_type, user_type ]);

    useEffect(() => {

        let error = !role ? "Required" : "";
        
        if (error !== err.role) {
            setErr({ ...err, role: error });
        }

    }, [ err, err.role, role ]);

    useEffect(() => {

        let error = !group ? "Required" : "";
        
        if (error !== err.group) {
            setErr({ ...err, group: error });
        }

    }, [ err, err.group, group ]);

    useEffect(() => {

        let error = !username ? "Required" : "";
        
        if (error !== err.username) {
            setErr({ ...err, username: error });
        }

    }, [ err, err.username, username ]);

    useEffect(() => {

        let error = !password ? "Required" : "";

        if (password && !isPassword(password)) {
            error = "Must at least eight characters, one number, and only one special character."   
        } 

        if (error !== err.password) {
            setErr({ ...err, password: error });
        }

    }, [ err, err.password, password ]);

    function clearData () {
        setTab(0);
        setDialogMessage("");
        setData(initialValues);
        setSuccess(false);
    }   

    function getRoles (user_type) {
        const roles = [];
        for (const item of Roles) {
            item.user_type.id === user_type && roles.push(item);
        }
        return roles;
    }

    function postEmployee () {

        const employeeData = {
            employee_type: employee_type,
            employee_no: employee_no,
            sur_name: sur_name,
            first_name: first_name,
            middle_name: middle_name,
            name_extension: name_extension,
            sex: sex,
            birthdate: birthdate,
            age: age,
            birthplace: birthplace,
            civil_status: civil_status,
            email: email,
            position: position,
            start_date: start_date,
            end_date: end_date,
            date_hired: date_hired,
        }

        axios.post(HOST + "/api/employees/new/", employeeData)
        .then(response => {

            const { data } = response.data;
            const employeeID = data.id;

            updateJobStatus(position, 0);
            
            addUser(employeeID);
            
            updateEmployeeStatus(employeeID);

            createEmployeeStatusHistory(employeeID);

            createUserAcitivity(
                getUserID(), 
                "Employee", 
                "Add Employee", 
                "Added Employee " + data.employee_no
            );

            createJobHistory({
                employee: employeeID,
                department: department,
                position: position,
                department_head_id: departmentHead,
                start_date: start_date,
                end_date: end_date,
                created_at: currentDate,
                date_hired: date_hired,
            })

            setDialogMessage(response.data.message, true);

        }).catch(error => {

            setDialogMessage(error.response.data.message);

            setTimeout(() => {
                setMessage("");
            }, 1000)

        })  
    }

    function updateEmployeeStatus(employeeID) {
        axios.patch(getHost() + "/api/employees/update/" + employeeID + "/", {
            employee_status: 1,
        }).then(response => {  
           console.log(response.data);
        }).catch(error => {
            console.log(error);
            return false;
            // setDialogMessage(error.response.data.message);
        })
    }

    function createEmployeeStatusHistory(employeeID) {

        const statusHistory = {
            employee: employeeID,
        }

        axios.post(getHost() + "/api/employee-status-histories/new/", statusHistory)
        .then(response => {  
            console.log(response.data);
            // setDialogMessage("Employee Added Successfully!", true);
        }).catch(error => {
            console.log(error);
            return false;
            // setDialogMessage(error.response.data.message);
        })
    }

    function addUser(employee){

        const user = {
            employee: employee,
            user_type: user_type,
            role: role,
            username: employee_no, 
            password: employee_no,
            email: email,
            first_name: first_name,
            sur_name: sur_name,
            created_at: getDateTime(),
        }

        axios.post(HOST +  "/api/users/new/", user)
        .then(response => {
            console.log(response.data)
            const { data } = response.data;
            const userID = data.id;
            postUserGroups(userID);
        }).catch(error => {
            console.log(error);
            return false;
            // setDialogMessage(error.response.data.message)
        })
    }
    
    function postUserGroups(user){

        const userGroup = {
            user: user,
            group: group,
        }

        axios.post(HOST + "/api/user-groups/new/", userGroup)
        .then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error);
            return false;
            // setDialogMessage(error.response.data.message)
        })    
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
            postEmployee();
        }
    }

    const tabs = [
        { id: 0,  title: "basic information" },
        { id: 1, title: "work information" },
        { id: 2, title: "user account" },
    ];

    function renderBasicInformation() {
        return (
            <div>
                <Select 
                    errMessage={err.employee_type}
                    id="employee_type" 
                    label={"employee type"} 
                    value={employee_type} 
                    options={EmployeeTypes} 
                    refresh={()=> fetchEmployeeTypes()} 
                    createText="Add Employee Type" 
                    create={ADD_EMPLOYEE_TYPE}
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.employee_no}
                    id="employee_no" 
                    label="employee no"
                    value={employee_no} 
                    placeholder="E.g. 1111-1"
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.sur_name}
                    id="sur_name" 
                    label="surname" 
                    placeholder="Doe"
                    value={sur_name} 
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.first_name}
                    id="first_name" 
                    label="firt name" 
                    value={first_name} 
                    placeholder="John"
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.middle_name}
                    id="middle_name" 
                    label="middlename" 
                    value={middle_name}
                    placeholder="Max"
                    onChange={handleInputChange} 
                />
                <Select 
                    errMessage={err.name_extension}
                    id="name_extension" 
                    label="name extension" 
                    value={name_extension}
                    options={NameExtensions} 
                    refresh={()=> fetchEmployeeTypes()} 
                    createText="Add Name Extension" 
                    create={ADD_NAME_EXTENSION}
                    onChange={handleInputChange}
                />
                <Select 
                    errMessage={err.sex}
                    id="sex" 
                    label="sex" 
                    value={sex}
                    options={Sexes} 
                    onChange={handleInputChange} 
                />
                <Select 
                    errMessage={err.civil_status}
                    id="civil_status" 
                    label="civil status" 
                    value={civil_status} 
                    options={CivilStatuses} 
                    createText="Add Civil Status" 
                    create={ADD_CIVIL_STATUS}
                    refresh={()=> fetchCivilStatuses()}
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.birthdate}
                    type="date" 
                    id="birthdate" 
                    label="birthdate" 
                    value={birthdate} 
                    onChange={handleInputChange} 
                />
                <Input 
                    type="text" 
                    label="age" 
                    placeholder="---"
                    disabled={true}
                    value={age} 
                />
                 <Select 
                    errMessage={err.birthplace}
                    id="birthplace" 
                    label="birthplace" 
                    value={birthplace}  
                    options={Cities} 
                    createText="Add City" 
                    create={ADD_CITY}
                    refresh={()=> fetchCities()}
                    onChange={handleInputChange} 
                />
                <Input 
                    id="email" 
                    label="email"
                    value={email}
                    placeholder="johndoe@gmail.com" 
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.date_hired}
                    type="date"
                    id="date_hired"
                    label="date hired"
                    value={date_hired} 
                    onChange={handleInputChange} 
                />
            </div>
        )
    }

    function renderWorkInformation() {
        return (
            <div>
                <Select 
                    errMessage={err.department}
                    id="department" 
                    label="Department" 
                    createText="Add Department"  
                    create={ADD_DEPARTMENT}
                    value={department}
                    options={Departments} 
                    refresh={()=> fetchDepartments()} 
                    onChange={handleInputChange} 
                />
                <Select 
                    disabled={true}
                    label="Department Head" 
                    value={departmentHead}
                    options={Employees}  
                    onChange={handleInputChange} 
                />
                <Select 
                    errMessage={err.position}
                    id="position" 
                    label="Position"
                    createText="Add Position"  
                    create={ADD_POSITION}
                    value={position}
                    options={Positions}  
                    refresh={()=> fetchPositions()}
                    onChange={handleInputChange} 
                />
                <Select 
                    label="Salary" 
                    value={salary}
                    disabled={true}
                    options={Salaries}  
                />
                <Input 
                    errMessage={err.start_date}
                    id="start_date" 
                    label="start date" 
                    type="date" 
                    value={start_date} 
                    onChange={handleInputChange} 
                    />
                <Input 
                    errMessage={err.end_date}
                    id="end_date" 
                    label="end date" 
                    type="date" 
                    value={end_date} 
                    onChange={handleInputChange} 
                    display={isWithEndDate || probationaryPeriod}
                    />
            </div>
        )
    }

    function renderUserAccount() {
        return (
            <div>
                <Select 
                    errMessage={err.user_type}
                    id="user_type" 
                    label="user type" 
                    value={user_type}
                    options={UserTypes} 
                    refresh={()=> fetchUserTypes()} 
                    onChange={handleInputChange} 
                />
                <Select 
                    errMessage={err.role}
                    id="role" 
                    label="role" 
                    value={role}
                    disabled={!user_type ? true : false}     
                    options={getRoles(parseInt(user_type))} 
                    createText="Add Role"
                    create={ADD_ROLE}
                    refresh={()=> fetchRoles()}  
                    onChange={handleInputChange} 
                />
                <Select 
                    errMessage={err.group}
                    id="group" 
                    label="group" 
                    value={group}
                    options={Groups} 
                    disabled={!user_type ? true : false}     
                    refresh={()=> fetchGroups()}  
                    createText="Add Group"
                    create={ADD_GROUP}
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.username}
                    id="username"
                    label="username"
                    value={username} 
                    placeholder="Johndoe12345"
                    onChange={handleInputChange} 
                />
                <Input 
                    errMessage={err.password}
                    id="password"
                    label="password"
                    value={password} 
                    placeholder="Johndoe12345"
                    onChange={handleInputChange} 
                />
                <Input 
                    label="surname"
                    disabled={true} 
                    value={sur_name} 
                    placeholder="Doe"
                    onChange={handleInputChange} 
                />
                <Input 
                    label="first name"
                    disabled={true} 
                    value={first_name} 
                    placeholder="John"
                    onChange={handleInputChange} 
                    />
                <Input 
                    label="email"
                    disabled={true} 
                    value={email} 
                    placeholder="johndoe@gmail.com"
                    onChange={handleInputChange} 
                />
            </div>
        )
    }

    return (
        display ?
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Add New Employee"
                                    onClick={()=> {
                                        setData(initialValues);
                                        history.goBack();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="tab p-0">
                                {tabs.map(item =>{
                                    const { id, title } = item;
                                    return (
                                        <li key={id}
                                            className="tabItem" style={{
                                                color: id === tab ? 'rgb(50, 50, 50)' : 'black',
                                                backgroundColor: id === tab ? 'rgb(220,250,220)' : 'white',
                                            }}
                                            onClick={e => {
                                                e.preventDefault();
                                                setTab(id);
                                            }}
                                        >
                                            {title}                                    
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="content">
                                <form onSubmit={handleSubmit}>
                                    <DialogBox 
                                        message={message} 
                                        isSuccess={isSuccess}
                                        onClose={() => setMessage("")}
                                    />
                                    {
                                        tab === 0 ? renderBasicInformation() : 
                                        tab === 1 ? renderWorkInformation() : renderUserAccount()
                                    }
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <Button 
                                                disabled={tab === 0 ? true : false}  
                                                text="Previous"
                                                onClick={() => setTab(tab => tab - 1)} 
                                            />
                                            <Button 
                                                disabled={tab === 2 ? true : false}  
                                                text="Next"
                                                onClick={() => setTab(tab => tab + 1)} 
                                            />
                                        </div>
                                        <div className="col-lg-6 text-end">
                                            { !isSuccess && 
                                                hasChanges(data) &&
                                                <CancelButton 
                                                    text="Reset" 
                                                    onClick={() => clearData()} 
                                                /> 
                                            }
                                            <SubmitButton 
                                                text={isSuccess ? "New" : "Save"} 
                                                disabled={hasChanges(err)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div> : null
    )
}

export default AddEmployee;