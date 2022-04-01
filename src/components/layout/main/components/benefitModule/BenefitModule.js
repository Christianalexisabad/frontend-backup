import { pathContains } from '../../../../../utility/Functions';
import { BENEFIT_MODULE } from '../../../../../utility/Route';
import MyBenefits from './components/myBenefits/MyBenefits';

function BenefitModule() {

    const display = pathContains(BENEFIT_MODULE)

    return (  
        display &&
        <div className="BenefitModule">
            <div className="row">
                <div className="col-lg-12">
                    {/* <ApplyLeave /> */}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <MyBenefits />
                </div>
            </div>
        </div>
    );
}

export default BenefitModule;