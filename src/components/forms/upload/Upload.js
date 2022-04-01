import Button from '../button/Button';
import './Upload.css';

const Upload = (props) => {

    const disabled = props.disabled;
    const text = props.text ? props.text : "Upload";

    return(
        <div className="Upload" style={{
            width: 'auto',
            display: "inline-block"
         }}>
            <Button>
                <i className="fa fa-upload"></i> {text}
                <input type="file" disabled={disabled} onChange={props.onChange}/>
            </Button>
        </div>
    )
}

export default Upload;