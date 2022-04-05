import "./CustomButton.css";

function CustomButton(props) {

    let { text, onClick } = props;

    return (
        <button className="CustomButton" type="button" onClick={onClick}>
            {text ? text : "Text"}
        </button>
    )
}

export default CustomButton;