import { pathContains } from '../../../../../utility/Functions';
import { LEAVE_MODULE } from '../../../../../utility/Route';
import MyLeave from './components/myLeave/MyLeave';
import ApplyLeave from './components/leaveApplication/ApplyLeave';

function LeaveModule() {

    const display = pathContains(LEAVE_MODULE)

    return (  
        display &&
        <div className="LeaveModule">
            <div className="row">
                <div className="col-lg-12">
                    <ApplyLeave />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <MyLeave />
                </div>
            </div>
        </div>
    );
}

export default LeaveModule;