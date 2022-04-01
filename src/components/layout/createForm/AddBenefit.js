import CancelButton from "../../forms/cancelButton/CancelButton";
import SubmitButton from "../../forms/submitButton/SubmitButton";
import { getData, isPath } from "../../../utility/Functions";
import DialogBox from "../../forms/dialogBox/DialogBox";
import { getHost } from "../../../utility/APIService";
import React, { useEffect, useState } from "react";
import Select from "../../forms/select/Select";
import { useHistory } from "react-router-dom";
import Input from "../../forms/input/Input";
import Title from "../../forms/title/Title";
import axios from "axios";
import "./Style.css";
import { ADD_BENEFITS, ADD_GOVERNMENT_COMPANY } from "../../../utility/Route";
import { getDateTime } from "../../../utility/DateTime";

const AddBenefit = () => {

    const display = isPath(ADD_BENEFITS);
    const history = useHistory();

    const initialValues = {
        id: "",
        salary: 0,
        benefit: null,
        employee_share: 0,
        employee_share_percent: "",
        employer_share: 0,
        employer_share_percent: "",
        total_percent: "",
        total: 0,
        contribution: null,
        contribution_deadline: null,
        employee: null,
        employee_name: "",
    }
    
    const [data, setData] = useState(initialValues);
    const [message, setMessage] = useState("");
    const [isSuccess, setSuccess] = useState(false);

    const [Employees, setEmployees] = useState([]);
    const [Contributions, setContributions] = useState([]);
    const [BenefitTypes, setBenefitTypes] = useState([]);

    const fetchEmployees = async () => {
        let response = await axios.get(getHost() + "/api/employees/");
        let { data } = await response.data;
        setEmployees(data);
    }

    const fetchBenefitTypes = async () => {
        let response = await axios.get(getHost() + "/api/government-companies/");
        let { data } = await response.data;
        setBenefitTypes(data);
    }

    const fetchContributions = async () => {
        let response = await axios.get(getHost() + "/api/contributions/");
        let { data } = await response.data;
        setContributions(data);
    }

    useEffect(() => {
        if (display) {
            fetchEmployees();
            fetchBenefitTypes();
            fetchContributions();
        } else {
            clearData();
        }
    }, [display]);

    const {
        salary,
        benefit,
        employee_share,
        employer_share,
        contribution_deadline,
        employer_share_percent,
        employee_share_percent,
        total,
        total_percent,
        employee,
        employee_name
    }= data;

    const handleInputChange = (e) => {
        e.preventDefault();
        const { id, value } = e.target;
        setData({ ...data, [id]: value });        
    }

    function clearData () {
        setMessage("");
        setData(initialValues);
        setSuccess(false);
    }   

    function calculateContributions (benefit, salary) {

        for (const item of Contributions) {
            const min_salary = parseFloat(item.min_salary);
            const max_salary = parseFloat(item.max_salary);

            const { employee_share, employer_share } = item;

            if (item.government_company === benefit && salary >= min_salary && salary <= max_salary) {

                setData({ ...data, 
                    employee_share_percent: " = " + parseFloat(employee_share) + "%",
                    employer_share_percent: " = " + parseFloat(employer_share) + "%",
                    total_percent: " = " + (parseFloat(employer_share) + parseFloat(employee_share) + "%"),
                    employer_share: (salary * (parseFloat(employer_share) / 100)).toFixed(2),
                    employee_share: (salary * (parseFloat(employee_share) / 100)).toFixed(2),
                    total: ((salary * (parseFloat(employer_share) / 100)) + (salary * (parseFloat(employee_share) / 100))).toFixed(2)
                })
            }
        }
    }

    useEffect(() => {
        if (employee) {
            setData({ ...data, 
                employee_name: getData(parseInt(employee), 'first_name', Employees) + " " + getData(parseInt(employee), 'sur_name', Employees),
            })
        }else {
            setData({ ...data, 
                employee_name: "",
                salary: 0
            })
        }
    }, [employee])

    useEffect(() => {
        if (benefit && salary) {
            calculateContributions(parseInt(benefit), parseFloat(salary))
        }else {
            setData({ ...data, 
                employer_share: "",
                employer_share_percent: "",
                employee_share: "",
                employee_share_percent: "",
                total_percent: "",
                total: 0,
            })
        }
    }, [ benefit, salary ])


    const handleSubmit = (e) => { 
        e.preventDefault();  

        if (isSuccess) {
            clearData();
        } else {
                axios.post(getHost() + "/api/benefits/new/", {
                    government_company: benefit,
                    employee_share: employee_share,
                    employer_share: employer_share,
                    employer_share_percent: employer_share_percent.split("= ")[1],
                    employee_share_percent: employee_share_percent.split("= ")[1],
                    contribution_deadline: contribution_deadline,
                    total: total,   
                    total_percent: total_percent.split("= ")[1],
                    employee: employee,
                    date_added: getDateTime()
                })  
                .then(res => {
                    setMessage("Added Successfully!");
                    setSuccess(true);
                }).catch(err => {
                    setMessage(err.response.data.message);                    
                    setSuccess(false);                
                })
        }
    }

    return (
        display &&
        <div className="CreateForm">
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header text-start">
                                <Title 
                                    text="Add Benefit"
                                    onClick={() => {
                                        setMessage("");
                                        setData(initialValues);
                                        history.goBack();
                                    }}
                                />
                            </div>
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
                                    <Select 
                                        id="employee" 
                                        label="employee" 
                                        value={employee} 
                                        options={Employees} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        id="employee_name"  
                                        label="Employee Name" 
                                        disabled={true}
                                        value={employee_name} 
                                    />
                                    <Input 
                                        type="number" 
                                        id="salary" 
                                        label="salary" 
                                        value={salary} 
                                        onChange={handleInputChange} 
                                    />  
                                    <Select 
                                        id="benefit" 
                                        label="type" 
                                        value={benefit} 
                                        options={BenefitTypes} 
                                        createText={"Add New"} 
                                        create={ADD_GOVERNMENT_COMPANY} 
                                        refresh={()=> fetchBenefitTypes()} 
                                        onChange={handleInputChange} 
                                    />
                                    <Input 
                                        type="number"
                                        disabled={true}
                                        id="employer_share" 
                                        label={"employer share" + employer_share_percent}
                                        value={employer_share} 
                                    />
                                    <Input 
                                        type="number" 
                                        disabled={true}
                                        id="employee_share" 
                                        label={"employee share" + employee_share_percent}
                                        value={employee_share} 
                                    />   
                                    <Input 
                                        type="number" 
                                        disabled={true}
                                        id="total" 
                                        label={"total" + total_percent}
                                        value={total} 
                                    />    
                                    <Input 
                                        type="date"
                                        id="contribution_deadline" 
                                        label="contribution deadline" 
                                        value={contribution_deadline} 
                                        onChange={handleInputChange} 
                                    /> 
                                    <div className="btnContainer">
                                        <CancelButton 
                                            text="Clear" 
                                            isSuccess={isSuccess} 
                                            onClick={()=> {
                                                setMessage("");
                                                setData(initialValues);
                                            }}
                                        />
                                        <SubmitButton text={isSuccess ? "New" : "Save"} /> 
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div> 
    )
}

export default AddBenefit;