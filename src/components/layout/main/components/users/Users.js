import { isPath } from "../../../../../utility/Functions";
import { USER_MODULE } from "../../../../../utility/Route";
import UserList from "../table/UserList";

function UserModule() {

    const display = isPath(USER_MODULE);

    return ( 
        display &&
        <div className="UserModule">
            <div className="row">
                <div className="col-lg-12">
                    <UserList />
                </div>
            </div>
        </div>
     );
}

export default UserModule;