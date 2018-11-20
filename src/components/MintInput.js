

import React, { Component } from 'react';
import {
    ControlLabel, FormControl, Button
  } from 'react-bootstrap';

class MintInput extends Component {

    state = {
        quantity: this.props.quantity, 
        handleQuantityChange: this.props.handleQuantityChange, 
        beneficiaryAddress: this.props.beneficiaryAddress, 
        handleBeneficiaryAddressChange: this.props.handleBeneficiaryAddressChange, 
        handleTokenMinting:this.props.handleTokenMinting,
        pending:this.props.pending
    }


    render(){
        return (<div>
            <ControlLabel>Mint</ControlLabel>
            <FormControl
                type={"number"} 
                value={this.state.quantity} 
                onChange={this.state.handleQuantityChange} 
                step={10000} min={0} />
            <ControlLabel>to recepient</ControlLabel>
            <FormControl
                value={this.state.beneficiaryAddress} 
                onChange={this.state.handleBeneficiaryAddressChange} />
                {this.renderMintButton(this.state.handleTokenMinting, this.state.pending)}
            
        </div>
    )}
        

    renderMintButton = (handleTokenMinting, pending) => {
        if(pending){
            return <Button disabled>Pending...</Button>
        }else{
            return< Button onClick={handleTokenMinting}>Mint</Button>
        }
        
    
    }
};
export default MintInput;