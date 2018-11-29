import Spinner from './Spinner';
import PropTypes from "prop-types";

const SetMinterSpinner = ({ isSpinning }) => (
    <Spinner isSpinning={isSpinning}/>
);
SetMinterSpinner.propTypes = {
    isSpinning: PropTypes.bool.isRequired
};
export default SetMinterSpinner;