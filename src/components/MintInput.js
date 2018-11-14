
import React, { Component, Container } from 'react';
import {
    ControlLabel, FormControl, Button
  } from 'react-bootstrap';
import PropTypes from "prop-types";


class MintInput extends Component {

    constructor (props) {
        super(props)
       //quantity, handleQuantityChange, beneficiaryAddress, handleBeneficiaryAddressChange, handleTokenMinting 
        console.log('Adding IXO')

        
    }
    render() {
        return (
            <Container>
                <ControlLabel>Distribute</ControlLabel>
                <FormControl
                    type={"number"} 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    step={10000} min={0} />
                <ControlLabel>to</ControlLabel>
                <FormControl
                    value={beneficiaryAddress} 
                    onChange={handleBeneficiaryAddressChange} />
                <Button onClick={handleTokenMinting}>Mint</Button>
            </Container>
        );
    }
}


MintInput.propTypes = {
    quantity: PropTypes.number.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    beneficiaryAddress: PropTypes.string.isRequired,
    handleBeneficiaryAddressChange: PropTypes.func.isRequired,
    handleTokenMinting: PropTypes.func.isRequired
};
export default MintInput;
