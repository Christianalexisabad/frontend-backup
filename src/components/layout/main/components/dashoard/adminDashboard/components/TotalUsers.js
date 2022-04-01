import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import "../AdminDashboard.css";

const TotalUsers = () => {

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/users/total/");
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
                    <p className="label">Users</p>
                </li>
                <li>
                    <i className="fas fa-user text-secondary"></i>
                </li>
            </ul>
        </div>
    )

}

export default TotalUsers;