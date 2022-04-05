import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import "./Style.css";

const Positions = () => {

    const [data, setData] = useState(0);
    const HOST = getHost();

    useState(() => {

        const fetchData = async() => {
            const response = await axios.get(HOST + "/api/positions/vacancies/")
            const { data } = await response.data;
            setData(data);
        }
        
        fetchData(); 
           
    }, [])

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{data}</p>
                    <p className="label">Jobs</p>
                </li>
                <li>
                    <i className="fa fa-briefcase text-dark"></i>
                </li>
            </ul>
        </div>
    )

}

export default Positions;