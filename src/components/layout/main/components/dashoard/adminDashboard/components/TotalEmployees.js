import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import "../AdminDashboard.css";

const TotalEmployees = () => {

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/employees/total/")
        const { data } = await response.data;
        setData(data);
    }

    useState(() => {
        fetchData();
    }, [])
    

    return (
        <div className="card">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">Employees</p>
                </li>
                <li>
                    <i className="fa fa-users text-primary"></i>
                </li>
            </ul>
        </div>
    )

}

export default TotalEmployees;