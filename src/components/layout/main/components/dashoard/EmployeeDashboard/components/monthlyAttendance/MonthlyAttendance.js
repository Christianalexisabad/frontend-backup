
import axios from "axios";
import React,{ useState } from "react";
import Chart from "react-apexcharts";
import { getHost } from "../../../../../../../../utility/APIService";
import { getCurrentDate, getReducedDate } from "../../../../../../../../utility/DateTime";
import { getEmployeeID } from "../../../../../../../../utility/Session";
import "./MonthlyAttendance.css";

const MonthlyAttendance = () => {

    const [state, setState] = useState({
        startDate: getReducedDate(getCurrentDate(), 6),
        endDate: getCurrentDate(),
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

    const fetchData = async(startDate, endDate) => {
       const response = await axios.get(getHost() + "/api/dashboard/employee-monthly-attendance/"+ getEmployeeID() +"/" + startDate + "/" + endDate + "/")
       const { data } = await response.data;
       
        setState({...state,
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
        });
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setState({...state, [e.target.id]: e.target.value});
    }
    
    return (
        <div className="MonthlyAttendance">
            <h1 className="title">Monthly Attendance</h1>
            <span className="from">From: </span>
            <input type="date" value={startDate} id="startDate" onChange={handleInputChange} />
            <span className="from"> To: </span>
            <input type="date" value={endDate} id="endDate" onChange={handleInputChange} />
            <i className="fa fa-search" onClick={()=> fetchData("2022-02-02", "2022-04-02")}></i>
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

export default MonthlyAttendance;