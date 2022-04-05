
import { pathContains } from '../../../../../utility/Functions';
import EmployeeList from '../../components/table/EmployeeList';
import AddEmployee from '../../../createForm/AddEmployee';

function Employee() {

    const display = pathContains("/pages/employee/")

    return (  
        display &&
        <div className="Employee">
            <div className="row">
                <div className="col-lg-12">
                    <EmployeeList />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <AddEmployee />
                </div>
            </div>
        </div>
    );
}

export default Employee;