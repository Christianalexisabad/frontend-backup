import axios from "axios";
import { getHost } from "./APIService";
import { getUserID } from "./Session";

export const hasPermission = (codeName) => {
    try {
        return localStorage.getItem("permissions").search(codeName) > -1 ? true : false;
    } catch (error) {
        return false;        
    }
}

export const fetchPermissions = async() => {
    
    let response = {};
    let permissions = [];
    const user = getUserID();
    
    response = await axios.get(getHost() + "/api/group-permissions/" + user +"/")
    const groupPermissions = await response.data;

    for (const { permission } of groupPermissions.data) {
        permissions.push(permission.code_name);
    }   

    response = await axios.get(getHost() + "/api/user-permissions/" + user +"/")
    const userPermissions = await response.data;

    for (const { permission } of userPermissions.data) {
        permissions.push(permission.code_name);
    }

    localStorage.setItem('permissions', JSON.stringify(permissions));
    return permissions;
}
