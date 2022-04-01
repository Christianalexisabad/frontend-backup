import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import "./Style.css";

const Departments = () => {

    const [data, setData] = useState(null);

    useState(() => {
       
        const fetchData = async() => {
            const response = await axios.get(getHost() + "/api/departments/total/")
            const { data } = await response.data;
            setData(data);
        }
        
        fetchData();
    }, [])
    

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{ data ? data : 0}</p>
                    <p className="label">Departments</p>
                </li>
                <li>
                    <i className="fa fa-building text-success"></i>
                </li>
            </ul>
        </div>
    )

}

export default Departments;