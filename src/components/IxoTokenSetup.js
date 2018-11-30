
import React, { Component } from 'react';
import CreateIxoToken from './CreateIxoToken';
import {
    Button, Alert
  } from 'react-bootstrap';

let regeneratorRuntime =  require("regenerator-runtime");

class IxoTokenSetup extends Component {
 
  constructor(props) {
    super(props);
    var localIxoTokenStorage = localStorage.getItem('erc20ContractAddress');
    this.state = {
        loading: true,
        isContractOwner: this.props.isContractOwner,
        isContractMinter: this.props.isContractMinter,
        minterAddress: '',
        pendingNewIxoContract: false,

        mintingTransactionQuantity: 0,
        mintingTransactionBeneficiaryAccount: '',
        web3Proxy: this.props.web3Proxy,
        erc20ContractAddress: localIxoTokenStorage?localIxoTokenStorage:null,
        newIxoToken: false,
        loadingIxoToken: false,
        timelockReleaseDate: ''
    };
}

componentWillReceiveProps(nextProps){
    if(nextProps.isContractOwner !== this.props.isContractOwner){
        this.setState({isContractOwner:nextProps.isContractOwner});
    }
    if(nextProps.isContractMinter !== this.props.isContractMinter){
        this.setState({isContractMinter:nextProps.isContractMinter});
    }
    if(nextProps.isIntermediary !== this.props.isIntermediary){
        this.setState({isIntermediary:nextProps.isIntermediary});
    }
}


    handleTokenMinting = event => {
		if (this.state.mintingTransactionBeneficiaryAccount && this.state.mintingTransactionQuantity > 0) {
            this.setState({pendingMint: true})
			this.state.web3Proxy
            .mintTo(this.state.mintingTransactionBeneficiaryAccount, this.state.mintingTransactionQuantity * 100000000)
            .then(txHash => {
                this.setState({ mintingTransactionBeneficiaryAccount: '', mintingTransactionQuantity: 0, pendingMint: false});
            })
            .catch(error => {
                console.log(`error: ${error}`);
            });
		}
    };
    
    handleIxoTokenAddressChange = event => {
		this.setState({erc20ContractAddress: event.target.value, loadingIxoToken: true });        
    }

    handleLoadIxoToken = () => {
        this.state.web3Proxy
        .loadIxoTokenContract(this.state.erc20ContractAddress)
        console.log(`IXO ERC20 Token Address: ${this.state.erc20ContractAddress}`);

        this.state.web3Proxy
        .getOwner().then((owner) => {
            this.setState({loadingIxoToken: false });
            localStorage.setItem('erc20ContractAddress', this.state.erc20ContractAddress);
            localStorage.setItem('erc20ContractOwnerAddress', owner);
    
        })

        
    }

    handleCreateIxoToken = () => {
        this.setState({pendingNewIxoContract: true})
        this.state.web3Proxy
        .createIxoTokenContract()
        .then(ixoTokenAddress => {
            this.setState({ erc20ContractAddress: ixoTokenAddress, newIxoToken: true, pendingNewIxoContract: false});
        console.log(`NEW IXO ERC20 Token Address: ${this.state.erc20ContractAddress}`);
        localStorage.setItem('erc20ContractOwnerAddress', this.state.web3Proxy.getSelectedAccount());
        localStorage.removeItem('erc20ContractMinterAddress');
        localStorage.setItem('erc20ContractAddress', this.state.erc20ContractAddress);
        })
        .catch(error => {
            console.log(`error: ${error}`);
            this.setState({pendingNewIxoContract: false, newIxoToken: false})
        });
    }

    


  render() {
    
    return ( 
      <div>
       
         { (!this.state.newIxoToken) && (<CreateIxoToken 
             handleCreateIxoToken={this.handleCreateIxoToken}
             handleLoadIxoToken={this.handleLoadIxoToken}
             handleIxoTokenAddressChange={this.handleIxoTokenAddressChange}
             pendingNewIxoContract={this.state.pendingNewIxoContract}
             erc20ContractAddress={this.state.erc20ContractAddress}
        />
        )}

        {(this.state.newIxoToken && this.state.erc20ContractAddress) && (
            <div>
                <Alert color="success">
                <div><span fontWeight="bold" >New IXO Token Address: {this.state.erc20ContractAddress}</span></div>
                <div><span fontWeight="bold" >Save this address to a secure location, press Done when you have</span></div>
                <div><span fontWeight="bold" >The Address can be used later to load the Token</span></div></Alert>
                <Button onClick={() => {this.setState({newIxoToken: false})}}>Done</Button>
            </div>
        )}
 
      </div>
    );
  }
}

export default IxoTokenSetup;