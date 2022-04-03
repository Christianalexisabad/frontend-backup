import { ADD_CITY, ADD_CIVIL_STATUS, ADD_DEPARTMENT, ADD_EMPLOYEE, ADD_EMPLOYEE_TYPE, ADD_GROUP, ADD_NAME_EXTENSION, ADD_POSITION, ADD_ROLE } from "../../../utility/Route";
import { errMessage, isAddress, isBirthDate, isMiddleName, isName } from "../../../utility/Regex";
import { createJobHistory, createUserAcitivity, getHost, updatePositionStatus } from "../../../utility/APIService";
import { getAge, getCurrentDate, getDateTime, getEndDate} from "../../../utility/DateTime";
import { getData, isPath } from "../../../utility/Functions";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import CancelButton from "../../forms/cancelButton/CancelButton";
import { getEmployeeID, getUserID } from "../../../utility/Session";
import DialogBox from "../../forms/dialogBox/DialogBox";
import React, { useEffect, useState } from "react";
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
    age: 0,
    civil_status: null, 
    email: "", 
    employee_no: "", 
    employee_type: null, 
    department: "", 
    create_account: "true",
    user: null,
    user_type: null,
    role: null, 
    group: null,
    username: "",
    departmentName: "",
    department_head: 0,
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
        let { data } = await response.data;
        setDepartments(data);
    }

    const fetchEmployees = async () => {
        const response = await axios.get(getHost() + "/api/employees/names/")
        let { data } = await response.data;
        setEmployees(data);
    }

    const fetchSalaries = async () => {
        const response = await axios.get(getHost() + "/api/salaries/")
        let { data } = await response.data;
        setSalaries(data);
    }

    const fetchPositions = async (department) => {
        const response = await axios.get(getHost() + "/api/positions/vacant/"+department+"/")
        let { data } = await response.data;
        setPositions(data);
    }

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

    useEffect(() => {
       try {
            const newEndDate = getEndDate(start_date, probationaryPeriod);

            if (probationaryPeriod && start_date && (newEndDate !== end_date)) {
                setData({ 
                    ...data, 
                    end_date: newEndDate
                });
            }
       } catch (error) {
        //    console.log(error);
       }
    }, [ probationaryPeriod, start_date, data, end_date ])

    const handleInputChange = (e) => {
        e.preventDefault();

        const { id, value } = e.target;

        // set employee no and type
        if (id === "employee_type") {
            const employeeType = parseInt(value);
            const isAutoGenerated = getData(employeeType, "is_auto_generate_no", EmployeeTypes);
            setProbationaryPeriod(getData(employeeType, "period", EmployeeTypes))
            setIsWithEndDate(getData(employeeType, "is_with_end_date", EmployeeTypes));
        
            setData({ ...data,
                employee_type: value,
                employee_no: isAutoGenerated ? EmployeeNo : ""
            })

        } else if (id === "department") {

            const department = parseInt(value);
            fetchPositions(department);

            setData({ ...data,
                department: department,
                departmentHead: "fsdf"
            })
        } else if (id === "birthdate") {
            setData({ ...data,
                birthdate: value,
                age: getAge(value)
            })
        } else if (id === "position") {

            const salary = getData(parseInt(position), "salary", Positions);

            setData({ ...data,
                position: value,
                salary: salary
            })
        } else if (id === "end_date" && end_date <= start_date) {
            return false;
        } else {
            setData({ ...data, [id]: value });
        }
    }

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

    function addEmployee () {

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

        axios.post(HOST + "/api/employees/new/", employeeData).then(response => {

            const { data } = response.data;
            const employeeID = data.id;

            updatePositionStatus(position, 0);
            
            postUser(employeeID);
            
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
        }).then(res => {  
           
        }).catch(error => {
            setDialogMessage(error.response.data.message);
        })
    }

    function createEmployeeStatusHistory(employeeID) {

        const modified_by = getEmployeeID();

        axios.post(getHost() + "/api/employee-status-histories/new/", {
            employee: employeeID,
            modified_by: modified_by ? modified_by : 0,
        }).then(res => {  
            setDialogMessage("Employee Added Successfully!", true);
        }).catch(error => {
            setDialogMessage(error.response.data.message);
        })
    }

    function postUser(employee){
        axios.post(HOST +  "/api/users/new/", {
            employee: employee,
            user_type: user_type,
            role: role,
            username: employee_no, 
            password: employee_no,
            email: email,
            first_name: first_name,
            sur_name: sur_name,
            created_at: getDateTime(),
        })
        .then(response => {
            const user = response.data.data.id;
            postUserGroups(user);
        }).catch(error => {
            setDialogMessage(error.response.data.message)
        })
    }
    
    function postUserGroups(user){
        axios.post(HOST + "/api/user-groups/new/", {
            user: user,
            group: group,
        }).then(response => {
        }).catch(error => {
            setDialogMessage(error.response.data.message)
        })    
    }

    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
                if (!employee_type) {   
                    setDialogMessage("Please select employee type.")
                }else if (!employee_no) {   
                    setDialogMessage("Employee no is required.")
                }else if (!sur_name) {
                    setDialogMessage("Surname is required.")
                }else if (!first_name) {
                    setDialogMessage("First name is required.")
                }else if (!sex) {
                    setDialogMessage("Please select a sex.")
                }else if (!civil_status) {
                    setDialogMessage("Please select a civil status.")
                }else if (!isAddress(birthplace)) {
                    setDialogMessage("Birthplace contains invalid characters.")
                }else if (!isBirthDate(birthdate)) {
                    setDialogMessage(errMessage['birthdate'])
                }else if (!position) {   
                    setDialogMessage("Please select a position.")
                }else if (!department) {   
                    setDialogMessage("Please select an department.")
                }else if (!start_date) {   
                    setDialogMessage("Please select a start date.")
                }else if (!user_type) {   
                    setDialogMessage("Please select a user type.")
                }else if (!role) {   
                    setDialogMessage("Please select a role.")
                } else {
                    addEmployee();
                }
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
                    required
                    id="employee_type" 
                    label="employee type" 
                    value={employee_type} 
                    options={EmployeeTypes} 
                    refresh={()=> fetchEmployeeTypes()} 
                    createText="Add Employee Type" 
                    create={ADD_EMPLOYEE_TYPE}
                    onChange={handleInputChange} 
                />
                <Input 
                    required
                    id="employee_no" 
                    label="employee no"
                    value={employee_no} 
                    placeholder="E.g. 1111-1"
                    onChange={handleInputChange} 
                />
                <Input 
                    required
                    validate
                    id="sur_name" 
                    label="surname" 
                    value={sur_name} 
                    isValid={isName(sur_name)}
                    onChange={handleInputChange} 
                />
                <Input 
                    required
                    validate
                    id="first_name" 
                    label="firstname" 
                    value={first_name} 
                    isValid={isName(first_name)}
                    onChange={handleInputChange} 
                />
                <Input 
                    validate
                    id="middle_name" 
                    label="middlename" 
                    value={middle_name}
                    isValid={isMiddleName(middle_name)} 
                    onChange={handleInputChange} 
                />
                <Select 
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
                    required
                    id="sex" 
                    label="sex" 
                    value={sex}
                    options={Sexes} 
                    onChange={handleInputChange} 
                />
                <Select 
                    required
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
                    required
                    validate
                    type="date" 
                    id="birthdate" 
                    label="birthdate" 
                    value={birthdate} 
                    isValid={isBirthDate(birthdate)}  
                    onChange={handleInputChange} 
                />
                <Input 
                    type="text" 
                    label="age" 
                    disabled={true}
                    value={age} 
                />
                 <Select 
                    required
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
                    onChange={handleInputChange} 
                />
                <Input 
                    required
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
                    required
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
                    label="Employees" 
                    value={departmentHead}
                    options={Employees}  
                    onChange={handleInputChange} 
                />
                <Select 
                    required
                    id="position" 
                    label="Position" 
                    createText="Add Position"  
                    create={ADD_POSITION}
                    value={position}
                    options={Positions}  
                    refresh={()=> fetchPositions(department)}
                    onChange={handleInputChange} 
                />
                <Select 
                    label="Salary" 
                    value={salary}
                    disabled={true}
                    options={Salaries}  
                />
                <Input 
                    id="start_date" 
                    label="start date" 
                    type="date" 
                    value={start_date} 
                    onChange={handleInputChange} 
                    />
                <Input 
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
                    id="user_type" 
                    label="user type" 
                    value={user_type}
                    options={UserTypes} 
                    refresh={()=> fetchUserTypes()} 
                    onChange={handleInputChange} 
                />
                <Select 
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
                    id="username"
                    label="username"
                    disabled={true} 
                    value={employee_no} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="password"
                    disabled={true} 
                    value={employee_no} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="surname"
                    disabled={true} 
                    value={sur_name} 
                    onChange={handleInputChange} 
                />
                <Input 
                    label="first name"
                    disabled={true} 
                    value={first_name} 
                    placeholder="First Name"
                    onChange={handleInputChange} 
                    />
                <Input 
                    label="email"
                    disabled={true} 
                    value={email} 
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
                                            <Button disabled={tab === 0 ? true : false}  icon="fa fa-angle-left" onClick={() => setTab(tab => tab - 1)} />
                                            <Button disabled={tab === 2 ? true : false}  icon="fa fa-angle-right" onClick={() => setTab(tab => tab + 1)} />
                                        </div>
                                        <div className="col-lg-6">
                                            { !isSuccess && <CancelButton text="Reset" onClick={() => clearData()} /> }
                                            <SubmitButton text={isSuccess ? "New" : "Save"} />
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