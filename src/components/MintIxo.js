

import React, { Component } from 'react';
import {
    ControlLabel, FormControl, Button, Alert
  } from 'react-bootstrap';

import MintSpinner from './spinners/MintSpinner'

class MintIxo extends Component {

    state = {
        handleQuantityChange: this.props.handleQuantityChange, 
        handleBeneficiaryAddressChange: this.props.handleBeneficiaryAddressChange, 
        handleTokenMinting:this.props.handleTokenMinting,
        isContractMinter:this.props.isContractMinter, 
        pending:this.props.pending
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.pending !== this.props.pending){
            this.setState({pending:nextProps.pending});
        }
        if(nextProps.isContractMinter !== this.props.isContractMinter){
            this.setState({isContractMinter:nextProps.isContractMinter});
        }
    }

    render(){
        return (<div>
        { this.state.isContractMinter && (
            <div>
                <ControlLabel>Number or IXO to Mint</ControlLabel>
                <FormControl
                    onChange={this.state.handleQuantityChange} />
                <ControlLabel>to recepient</ControlLabel>
                <FormControl
                    onChange={this.state.handleBeneficiaryAddressChange} />
                    {this.renderMintButton(this.state.handleTokenMinting, this.state.pending)}
                <MintSpinner isSpinning={this.state.pending}/>

            </div>
        )} 
        { (!this.state.isContractMinter) && (
            <Alert color="warning">Not the Contract minter</Alert>
        )} 
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
export default MintIxo;