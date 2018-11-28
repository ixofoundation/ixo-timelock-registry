import Spinner from './Spinner';
import PropTypes from "prop-types";

const NewContractSpinner = ({ isSpinning }) => (
    <Spinner isSpinning={isSpinning}/>
);
NewContractSpinner.propTypes = {
    isSpinning: PropTypes.bool.isRequired
};
export default NewContractSpinner;