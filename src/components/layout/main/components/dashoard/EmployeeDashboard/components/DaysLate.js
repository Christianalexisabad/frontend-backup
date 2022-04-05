import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import { getEmployeeID } from "../../../../../../../utility/Session";
import "../EmployeeDashboard.css";

const DaysLate = () => {

    const employee = getEmployeeID();

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/attendances/get-attendance/" + employee + "/late/")
        const { data } = await response.data;
        setData(typeof data === 'number' ? data : 0);
    }

    useState(() => {
        fetchData();
    }, [])
    

    return (
        <div className="card">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">Days Late</p>
                </li>
                <li>
                    <i className="fa fa-calendar-o text-warning"></i>
                </li>
            </ul>
        </div>
    )

}

export default DaysLate;