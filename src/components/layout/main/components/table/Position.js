import "./Table.css";
import { POSITIONS } from "../../../../../utility/Route";
import AddPosition from "../../../createForm/AddPosition";
import PositionList from "./PositionList";
import { pathContains } from "../../../../../utility/Functions";
import EditPosition from "../../../edit/EditPosition";

export default function Position() {

    const display = pathContains(POSITIONS);

    return (
        display &&
        <div className="Department">
            <div className="row">
                <div className="col">
                    <AddPosition />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <PositionList />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <EditPosition />
                </div>
            </div>
        </div>
    )
}