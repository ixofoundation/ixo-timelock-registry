
import React, { Component} from 'react';

import {
  ControlLabel, FormControl, FormGroup, Button, Alert
} from 'react-bootstrap';
let regeneratorRuntime =  require("regenerator-runtime");

export class IxoMint extends Component {
    constructor (props) {
        super(props)
        this.state = {
            // web3: props.web3,
            ixoToken: null,
            mintAmount: 0,
            recipient: '0x',
            minting: false,
            mintError: '',
            showError: false
        }
        console.log('Adding IXO')

        
    }


  handleMintAmountChange = event => {
    this.setState({ mintAmount: event.target.value });
  }
  handleAddressChange = event => {
    this.setState({ recipient: event.target.value });
  }


  handleMint = async event => {
    event.preventDefault();
    this.setState({
      minting: true, 
      mintError: ''
    })
    this.contracts.IxoERC20Token.methods.mint(this.state.recipient, this.state.mintAmount).send().then((succeeded) => {
        this.setState({
            minting: false, 
            mintError: ''
        })

    }).catch((err) => {
        this.setState({
            minting: false, 
            mintError: err
        })
        console.log(err) 
    });
  } 

  handleErrorDismiss() {
    this.setState({ showError: false , mintError: ''});
  }

  render() {
    return ( 
        <div>
            <form onSubmit={this.handleMint}>
                <FormGroup>
                    <ControlLabel>Amount to Mint</ControlLabel>
                    <FormControl 
                    type="text"
                    placeholder="total ixo amount"
                    onChange={this.handleMintAmountChange}
                    disabled={!this.state.valid || this.state.loading}/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Recipient</ControlLabel>
                    <FormControl 
                    type="text"
                    placeholder="receiving eth address"
                    onChange={this.handleAddressChange}
                    disabled={!this.state.valid || this.state.loading}/>
                </FormGroup>
                <Button disabled={!this.state.valid || this.state.loading} type="submit">Mint</Button>
            </form>
            {this.state.mintError && <Alert bsStyle="danger" onDismiss={this.handleErrorDismiss}>
                    <h4>Error Minting</h4>
                    <p>
                        {this.state.mintError}
                    </p>
                    <p>
                        <Button onClick={this.handleErrorDismiss}>Dismiss</Button>
                    </p>
                </Alert>
    
            }
        </div>
        )
    }
}

IxoMint.propTypes = {
    quantity: PropTypes.number.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    beneficiaryAddress: PropTypes.string.isRequired,
    handleBeneficiaryAddressChange: PropTypes.func.isRequired,
    handleTokenMinting: PropTypes.func.isRequired
};
export default IxoMint;