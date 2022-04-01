import axios from "axios";
import { useState } from "react";
import { getHost } from "../../../../../../../../../utility/APIService";
import "./Style.css";

const Employees = () => {

    const [data, setData] = useState(null);

    useState(() => {

        axios.get(getHost() + "/api/employees/total/")
        .then(response => {
            const { data } = response.data;
            setData(data);
        })
        .catch(error => {
            setData(0);
            console.log(error);
        })

    }, [])
    

    return (
        <div className="TotalCard">
            <ul>
                <li>
                    <p className="value">{!data ? 0 : data}</p>
                    <p className="label">Employees</p>
                </li>
                <li>
                    <i className="fa fa-users text-primary"></i>
                </li>
            </ul>
        </div>
    )

}

export default Employees;