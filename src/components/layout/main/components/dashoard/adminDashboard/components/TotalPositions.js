import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../utility/APIService";
import "../AdminDashboard.css";

const DaysAbsent = () => {

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/positions/total/")
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
                    <p className="label">Positions</p>
                </li>
                <li>
                    <i className="fa fa-times text-danger"></i>
                </li>
            </ul>
        </div>
    )

}

export default DaysAbsent;