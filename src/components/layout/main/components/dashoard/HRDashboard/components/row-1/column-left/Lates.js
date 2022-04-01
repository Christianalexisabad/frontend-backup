import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import { getCurrentDate } from "../../../../../../../../../utility/DateTime";
import "./Style.css";

const Lates = () => {

    const [data, setData] = useState(0);

    const currentDate = getCurrentDate();

    const fetchData = async() => {
        const response = await axios.get(getHost() + "/api/attendances/status=2/date_range="+ currentDate +":"+ currentDate +"/")
        const { total } = await response.data;
        setData(total);
    }

    useState(() => {
        fetchData();
    }, [])
    

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">Lates</p>
                </li>
                <li>
                    <i className="fa fa-calendar-o text-warning"></i>
                </li>
            </ul>
        </div>
    )

}

export default Lates;