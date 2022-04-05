function Icon(props){

    const style = {
        width: props.width,
        color: props.color,
        float: props.float,
        margin: props.margin,
        padding: props.padding,
        display: props.display,
        fontSize: props.fontSize,
        backgroundColor: props.backgroundColor,
    }

    return(
        <i 
            id={props.id} 
            className={props.className} 
            style={style}
            onClick={props.onClick}
        >

        </i>
    )
}

export default Icon;