
import React, { Component } from 'react';

import {
    ControlLabel, FormControl, Button, Alert
  } from 'react-bootstrap';
import NewContractSpinner from './spinners/NewContractSpinner';

class CreateIxoToken extends Component {

    state = {
        handleCreateIxoToken : this.props.handleCreateIxoToken,
        handleLoadIxoToken : this.props.handleLoadIxoToken,
        handleIxoTokenAddressChange: this.props.handleIxoTokenAddressChange,
        pending: this.props.pendingNewIxoContract,
        erc20ContractAddress: this.props.erc20ContractAddress
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.pendingNewIxoContract !== this.props.pendingNewIxoContract){
            this.setState({pending:nextProps.pendingNewIxoContract});
        }
        if(nextProps.erc20ContractAddress !== this.props.erc20ContractAddress){
            this.setState({erc20ContractAddress:nextProps.erc20ContractAddress});
        }
    }
    render(){
        return (
            <div>

                <Alert color="info">IXO Token Currently loaded at address: {this.state.erc20ContractAddress}</Alert>
                <ControlLabel>IXO Token Address</ControlLabel>
                <FormControl
                    placeholder='Enter existing IXO Token Address' 
                    onChange={(e) => this.state.handleIxoTokenAddressChange(e)} />
                {this.renderLoadButton()}
                {this.renderNewButton()}
                <NewContractSpinner isSpinning={this.state.pending}/>
            </div>
        )}

        renderLoadButton = () => {
            if(this.state.pending){
                return <Button disabled>Load IXO Token</Button>
            }else{
                return<Button onClick={(e) => {
                    e.preventDefault()
                    this.state.handleLoadIxoToken()
                }}>Load IXO Token</Button>
            }        
        }
        renderNewButton = () => {
            if(this.state.pending){
                return <Button disabled>New IXO Token</Button>
            }else{
                return<Button onClick={(e) => {
                    e.preventDefault()
                    this.state.handleCreateIxoToken()
                }}>New IXO Token</Button>
            }        
        }

};
export default CreateIxoToken;