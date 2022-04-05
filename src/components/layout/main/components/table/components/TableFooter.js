import "../Table.css";

const TableFooter = (props) => {

    const { total, current } = props;

    return (
        <div className="footer">
            <div className="row"> 
                <div className="col-lg-12">
                    <p>Showing 
                        <b>{total > 0 ? 1 : 0}</b>
                        <span> to </span> 
                        <b>{current}</b>
                        <span> of </span> 
                        <b>{total === 0 ? 0 : total}</b> 
                        <span> entries </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TableFooter;