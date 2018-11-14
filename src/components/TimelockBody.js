
import React, { Component } from 'react';
import {ixoTokenAbi, ixoTokenAddress} from '../config';
import {timelockRegTokenAbi, timelockRegTokenAddress} from '../config';
import {network} from '../config';


import Web3Proxy from '../web3/web3-proxy';
import MintInput from './MintInput';
// import Timelock from './Timelock';
let regeneratorRuntime =  require("regenerator-runtime");

class TimelockBody extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
        ixomint: this.props.showIxoMint,
        managetimelocks: this.props.showManageTimelocks,
        isContractOwner: false,
        mintingTransactionQuantity: 0,
        mintingTransactionBeneficiaryAccount: '',
        transferTransactionQuantity: 0,
        transferTransactionBeneficiaryAccount: '',
        web3Proxy: new Web3Proxy(
            ixoTokenAbi,
            ixoTokenAddress,
            timelockRegTokenAbi,
            timelockRegTokenAddress,
            this.handleSelectionChange,
            network
        ),
        erc20ContractAddress: config.get('ixoERC20TokenContract'),
        authContractAddress: config.get('authContract'),
        projectDid: ''
    };
}

    componentDidMount() {
        this.determineIfContractOwner();
    }

    handleSelectionChange = () => {
        this.determineIfContractOwner();
    };

    determineIfContractOwner = () => {
        this.state.web3Proxy.getNetwork().then(network => {
            const isContractNetwork = config.get('contractNetwork') === network;
            const isContractOwner = isContractNetwork && this.state.web3Proxy.getSelectedAccount().toUpperCase() === config.get('contractOwner').toUpperCase();
            this.setState({ isContractOwner });
        });
    };

  componentWillReceiveProps(nextProps) {
    this.setState({ 
        ixomint: nextProps.showIxoMint,
        managetimelocks: nextProps.showManageTimelocks
    });
  }

    getDefaultAccount = () => {
        const account = this.state.web3Proxy.getDefaultAccount();
        this.props.addOutputLine(account ? account : 'not set');
    };

    setDefaultAccount = () => {
        this.state.web3Proxy.getAccounts().then(accounts => {
            const account = accounts.length > 0 ? accounts[0] : 'no account';
            this.state.web3Proxy.setDefaultAccount(account);
        });
    };

    getAccount = () => {
        this.props.addOutputLine(this.state.web3Proxy.getSelectedAccount());
    };

    getAccounts = () => {
        this.state.web3Proxy.getAccounts().then(accounts => {
            this.props.addOutputLine(JSON.stringify(accounts));
        });
    };


  render() {

    return ( 
      <div>
        { this.state.ixomint && <MintInput 
            quantity={this.state.mintingTransactionQuantity}
            handleQuantityChange={this.handleMintingTransactionQuantityChange}
            beneficiaryAddress={this.state.mintingTransactionBeneficiaryAccount}
            handleBeneficiaryAddressChange={this.handleMintingTransactionBeneficiaryAddressChange}
            handleTokenMinting={this.handleTokenMinting}
        /> }else{
            <h1>oops</h1>
        }
        {/* { this.state.managetimelocks && <Timelock web3={this.state.web3} /> } */}
      </div>

    );
  }
}

export default TimelockBody;