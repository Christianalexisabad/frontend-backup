import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import { getEmployeeID } from "../../../../../../../utility/Session";
import "../EmployeeDashboard.css";

const DaysOnLeave = () => {

    const employee = getEmployeeID();

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "api/leaves/days-on-leave/"+employee+"/")
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
                    <p className="label">Days OnLeave</p>
                </li>
                <li>
                    <i className="fas fa-calendar-times text-warning"></i>
                </li>
            </ul>
        </div>
    )

}

export default DaysOnLeave;