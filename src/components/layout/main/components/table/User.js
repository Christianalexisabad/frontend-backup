import { isPath } from "../../../../../utility/Functions";
import UserList from "./UserList";

export default function User() {

    const display = isPath("/pages/user%20management/users/");
     return (
        display &&
        <div className="User">
            <UserList />
        </div> 
    )
}