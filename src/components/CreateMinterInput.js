
import React from 'react';
import {
    ControlLabel, FormControl, Button
  } from 'react-bootstrap';
import PropTypes from "prop-types";


const CreateMinter = ({ minterAddress, handleMinterAddressChange, handleCreateMinter }) => (

        <div>
            <ControlLabel>New Minter</ControlLabel>
            <FormControl
                value={minterAddress} 
                onChange={handleMinterAddressChange} />
            <Button onClick={() => {handleCreateMinter(minterAddress)}}>Create Minter</Button>
        </div>
);
CreateMinter.propTypes = {
    minterAddress: PropTypes.string.isRequired,
    handleMinterAddressChange: PropTypes.func.isRequired,
    handleCreateMinter: PropTypes.func.isRequired
};
export default CreateMinter;