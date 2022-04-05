import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import "./Style.css";

const OnLeave = () => {

    const [data, setData] = useState(0);

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/employees/on-leave/")
        const { data } = await response.data;
        setData(data);
    }

    useState(() => {
        fetchData();
    }, [])
    

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">OnLeave</p>
                </li>
                <li>
                    <i className="fa fa-calendar-times" style={{color: 'orange'}}></i>
                </li>
            </ul>
        </div>
    )

}

export default OnLeave;