
import React from 'react';
import {
    Label
  } from 'react-bootstrap';
  
import PropTypes from "prop-types";

const AccountInfo = ({ balance, lockedBalance }) => (
    <div>
        <h3>
            Current IXO Token Balance <Label>{balance}</Label>
        </h3>
        <h3>
            Locked IXO Token Balance  <Label>{lockedBalance}</Label>
        </h3>
    </div>
        
);
AccountInfo.propTypes = {
    balance: PropTypes.number.isRequired,
    lockedBalance: PropTypes.number.isRequired
};
export default AccountInfo;