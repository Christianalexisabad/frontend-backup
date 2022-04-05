import './UploadButton.css';

const UploadButton = (props) => {

    let { id, disabled, onChange, text } = props;

    disabled = disabled ? disabled : false;
    
    return (
        <button className="UploadButton" type="button">
            <input type="file" id={id} onChange={onChange} />
            <span>{ text ? text: "Upload" }</span>
        </button> 
    )
}

export default UploadButton;