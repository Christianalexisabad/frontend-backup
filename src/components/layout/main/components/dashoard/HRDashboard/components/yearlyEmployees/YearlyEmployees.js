import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getHost } from "../../../../../../../../utility/APIService";
import { getYear } from "../../../../../../../../utility/DateTime";
import "./YearlyEmployees.css";

const YearlyEmployees = () => {

    const [state, setState] = useState({
        startDate: getYear(-5),
        endDate: getYear(),
        options: {
            title: {
                enabled: false,
                style: {
                    fontWeight: 'normal',
                    color: 'rgb(120,120,120)'
                }
            },
            xaxis: {
                categories: []
                }
            },
        series: [
            {
                data: []
            }
        ],
    });

    const { startDate, endDate } = state;

    useEffect(()=> {    

        const fetchData = async() => {
            const response = await axios.get(getHost() + "/api/employees/by-year/"+ startDate+"/"+ endDate+"/")
            let { data } = await response.data;
    
            data = data ? data : [];
            
             setState(() => ({
                series: [
                    {
                        data: Object.values(data)
                    }
                ],
                options: { 
                    xaxis: {
                        categories: Object.keys(data) 
                    }
                }
            }));
        }

        if (startDate && endDate) {
            fetchData();
        }

    }, [ startDate, endDate ])

    const handleInputChange = (e) => {
        e.preventDefault();
        setState({...state, [e.target.id]: e.target.value});
    }
    
    return (
        <div className="YearlyEmployees">
            <h1 className="title">Yearly Employees</h1>
            <span className="from">From: </span>
            <input 
                id="startDate"
                type="number" 
                value={ startDate ? startDate : "" } 
                onChange={handleInputChange} 
            />
            <span className="from"> To: </span>
            <input 
                id="endDate" 
                type="number" 
                value={ endDate ? endDate : "" } 
                onChange={handleInputChange} 
            />
            <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="100%"
                height="250px"
            />
        </div>
    )
}

export default YearlyEmployees;