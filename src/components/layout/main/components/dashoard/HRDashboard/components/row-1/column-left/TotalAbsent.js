import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import { getCurrentDate } from "../../../../../../../../../utility/DateTime";
import "./Style.css";

const TotalAbsent = () => {

    const [data, setData] = useState(0);

    const currentDate = getCurrentDate();

    useState(() => {

        const fetchData = async() => {
            const response = await axios.get(getHost() + "/api/attendances/status=4/date_range="+ currentDate +":"+ currentDate +"/")
            const { total } = await response.data;
            setData(total);
        }
        
        fetchData();
    }, [])
    

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">Total Absent</p>
                </li>
                <li>
                    <i className="fa fa-times" style={{color: 'red'}}></i>
                </li>
            </ul>
        </div>
    )

}

export default TotalAbsent;