import { hasPermission } from "../../../utility/Permission";
import "./NextButton.css";

const NextButton = (props) => {

    const { disabled, permission, text, title} = props;

    const display = permission ? hasPermission(permission) : true;

    return (
        display ?
        <button 
            className="NextButton"
            type="button"
            title={title}
            disabled={disabled}
        >
            {text}
        </button> : null
    )
}

export default NextButton;