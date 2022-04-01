import React from 'react';
import './PageNotFound.css';

class PageNotFound extends React.Component {
    render() {
        return (
            <div className="PageNotFound container-fluid text-start"> 
                <div className="row">
                    <div className="col-lg-12">
                        <h4>
                           404 Not Found
                        </h4>
                        <p>
                           Sorry! The page your are looking for cannot be found.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageNotFound;
