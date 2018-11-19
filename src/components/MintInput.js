
import React from 'react';
import {
    ControlLabel, FormControl, Button
  } from 'react-bootstrap';
import PropTypes from "prop-types";


const MintInput = ({ quantity, handleQuantityChange, beneficiaryAddress, handleBeneficiaryAddressChange, handleTokenMinting }) => (
    <div>
        <ControlLabel>Mint</ControlLabel>
        <FormControl
            type={"number"} 
            value={quantity} 
            onChange={handleQuantityChange} 
            step={10000} min={0} />
        <ControlLabel>to recepient</ControlLabel>
        <FormControl
            value={beneficiaryAddress} 
            onChange={handleBeneficiaryAddressChange} />
        <Button onClick={handleTokenMinting}>Mint</Button>
    </div>
        
);
MintInput.propTypes = {
    quantity: PropTypes.number.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    beneficiaryAddress: PropTypes.string.isRequired,
    handleBeneficiaryAddressChange: PropTypes.func.isRequired,
    handleTokenMinting: PropTypes.func.isRequired
};
export default MintInput;