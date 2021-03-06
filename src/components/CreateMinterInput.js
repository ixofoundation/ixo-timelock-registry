import React, { Component } from 'react';
import {
    ControlLabel, FormControl, Button
  } from 'react-bootstrap';
import SetMinterSpinner from './spinners/SetMinterSpinner';
import {
    Alert
  } from 'react-bootstrap';
class CreateMinter extends Component {

    state = {
        isContractOwner: this.props.isContractOwner,
        currentMinter : this.props.minterAddress,
        handleMinterAddressChange : this.props.handleMinterAddressChange,
        handleCreateMinter: this.props.handleCreateMinter,
        pending: this.props.pendingCreateMinter,
        handleGetCurrentMinter: this.props.handleGetCurrentMinter
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.pendingCreateMinter !== this.props.pendingCreateMinter){
            this.state.handleGetCurrentMinter().then((minter) => {
                this.setState({currentMinter: minter, pending:nextProps.pendingCreateMinter})
            })
        }
        if(nextProps.isContractOwner !== this.props.isContractOwner){
            this.setState({isContractOwner:nextProps.isContractOwner});
        }


    }

    componentDidMount(){
        this.state.handleGetCurrentMinter().then((minter) => {
            this.setState({currentMinter: minter})
        })
    }
   
    render(){
        return (
        <div>

            {(this.state.currentMinter && this.state.isContractOwner) && (
                <Alert color="info">Current Minter: {this.state.currentMinter }</Alert>
            )}
            {(this.state.isContractOwner) && (
                <div>
                    <ControlLabel>New Minter</ControlLabel>
                    <FormControl
                        value={this.state.minterAddress} 
                        onChange={this.state.handleMinterAddressChange} />
                        {this.renderSetMinterButton(this.state.minterAddress)}
                    <SetMinterSpinner isSpinning={this.state.pending}/>
                </div>
            )}
            { (!this.state.isContractOwner) && (
                <div>
                    <Alert color="warning">Not the Contract Owner</Alert>
                </div>
            )}
        </div>
        )
    }



    renderSetMinterButton = () => {
        if(this.state.pending){
            return <Button disabled>Set Minter</Button>
        }else{
            return<Button onClick={
                this.state.handleCreateMinter}>Set Minter</Button>
        }        
    }
}
export default CreateMinter;