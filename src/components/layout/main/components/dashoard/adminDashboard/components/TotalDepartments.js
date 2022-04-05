import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import "../AdminDashboard.css";

const TotalDepartments = () => {

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/departments/total/")
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
                    <p className="label">Departments</p>
                </li>
                <li>
                    <i className="fa fa-building text-success"></i>
                </li>
            </ul>
        </div>
    )

}

export default TotalDepartments;