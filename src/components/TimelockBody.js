
import React, { Component } from 'react';
import {RELEASE_DATE_FORMAT, isReleaseDateValid, getReleaseDate} from '../config';

import moment from 'moment';

import ListTimelocks from './ListTimelocks';
import {
    Alert
  } from 'react-bootstrap';

let regeneratorRuntime =  require("regenerator-runtime");

class TimelockBody extends Component {
 
    state = {
        web3Proxy: this.props.web3Proxy,        
        beneficiaries: {},
        timelockReleaseDate: getReleaseDate()
    };
    


    getBalance = async (account) => {

        return this.state.web3Proxy
        .getBalance(account)
        .then(balance => {
            return balance;
        })
        .catch(console.error);
    };

    getSelectedAccountBalance =  () => {
        return this.state.web3Proxy.getBalance();
    };
    

    handleMinterTransactionAddressChange = event => {
        console.log(`minterAddress: ${event.target.value}`)
		this.setState({ minterAddress: event.target.value });
	};


    handleMintingTransactionQuantityChange = event => {
		this.setState({ mintingTransactionQuantity: parseInt(event.target.value) });
	};

	handleMintingTransactionBeneficiaryAddressChange = event => {
		this.setState({ mintingTransactionBeneficiaryAccount: event.target.value });
	};

	handleTimelockTransactionQuantityChange = event => {
		this.setState({ timelockTransactionQuantity: parseInt(event.target.value) });
	};

	handleTimelockTransactionBeneficiaryAddressChange = event => {
		this.setState({ timelockTransactionBeneficiaryAccount: event.target.value });
    };
    
    handleNewTimelock = (beneficiaryAddress, releaseDate) => {
        this.state.web3Proxy
        .createNewTimeLockContract(beneficiaryAddress, releaseDate)
        .then(timelockContractAddress => {
            this.updateBeneficiaries(beneficiaryAddress, timelockContractAddress)
        }).catch(error => {
            console.log(`error: ${error}`);
        });
    };

    updateBeneficiaries = (beneficiaryAddress, timelockContractAddress) => {
        let bCopy = Object.assign({}, this.state.beneficiaries);    //creating copy of object
        bCopy[beneficiaryAddress].timelockAddress = timelockContractAddress;                        //updating value
        this.setState({beneficiaries: bCopy});
        //this.updateBeneficiariesFile(this.state.beneficiariesFile);
    }

    updateBeneficiaryTxHash= (beneficiaryAddress, txHash) => {
        let bCopy = Object.assign({}, this.state.beneficiaries);    //creating copy of object
        bCopy[beneficiaryAddress].txHash = txHash;                        //updating value
        this.setState({beneficiaries: bCopy});
        //this.updateBeneficiariesFile(this.state.beneficiariesFile);
    }


    
    calculateTimeLeft = (releaseTime) => {
        var current = Math.floor(new Date().getTime()/1000);
        return (releaseTime > current)? releaseTime - current:0
    }

    handleRelease = (timelockAddress) => {
        this.state.web3Proxy
        .releaseTimelock(timelockAddress)
        .then(txHash => {
            console.log(`TX: ${txHash}`);
        }).catch(error => {
            console.log(`error: ${error}`);
        });
    }

    handleTransfer = (beneficiaryAddress, timelockAddress, amount, handleTransferComplete) => {
        this.state.web3Proxy
        .transferTo(timelockAddress, amount)
        .then(txHash => {
            this.updateBeneficiaryTxHash(beneficiaryAddress, txHash)
            handleTransferComplete(beneficiaryAddress,timelockAddress,amount)
        }).catch(error => {
            console.log(`error: ${error}`);
            handleTransferComplete(beneficiaryAddress,timelockAddress,amount)
        });
    }

 

    handleBeneficiaryFileLoad = event => {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (progressEvent) => {
            var beneficiaries = {}
            var lines = reader.result.split('\n');
            var transferPromises = []
            for(var line = 0; line < lines.length; line++){
                var lineString = lines[line];

                var splitLine = lineString.split(",")
                if (splitLine && splitLine.length > 2){
                    var address = splitLine[0];
                    var name = splitLine[1];
                    var amount = parseInt(splitLine[2].trim(), 10);
                    var timelockAddress
                    var txHash
                    if (splitLine.length > 2){
                        timelockAddress = splitLine[3]
                        if (timelockAddress){
                            timelockAddress = timelockAddress.replace(/\r?\n|\r/, "")
                        }
                    }
                    transferPromises.push(this.hasTransfered(address, amount, timelockAddress))

                    if (splitLine.length > 3){
                        txHash = splitLine[4]
                    }
    
                    beneficiaries[address] = {
                        address,
                        name,
                        amount,
                        timelockAddress,
                        txHash
                    }
                }else{
                    console.log('Error Reading file')
                }
            }
            Promise.all(transferPromises).then(res => {
                for(var i = 0; i< res.length; i++){
                    beneficiaries[res[i].address].hasTransfered = res[i].hasTransfered
                }
                if (beneficiaries && Object.entries(beneficiaries).length > 0){
                    this.setState({beneficiaries, beneficiariesFile: file})
                }
            })
            
        };
        reader.readAsText(file);
    }

    hasTransfered = async (address, amount, timelockAddress) => {
        if (timelockAddress){
            var lockedBalance =  await this.getBalance(timelockAddress)
            console.log(`address: ${address} - timelockAddress: ${timelockAddress} - lockedBalance: ${lockedBalance} - amount: ${amount}`)
            return {address, hasTransfered:(lockedBalance === amount)};
        }else{
            return {address, hasTransfered:false}
        }
    }
  
    getCurrentDateTime = () => {
        return moment().format(RELEASE_DATE_FORMAT);
    }

    handleReleaseDateSubmit = (e) => {
        e.preventDefault();
        if(isReleaseDateValid(this.state.timelockReleaseDate)){
            this.setState({enteringReleaseDate: false})
        }else{
            console.log(`releaseDate: ${this.state.timelockReleaseDate}`)
        }
    }

    handleReleaseDateChange = (e) => {
        this.setState({timelockReleaseDate: e.target.value})
    }

  render() {
    
    return ( 
        <div>
            {(!this.state.web3Proxy._erc20ContractAddress) && (<Alert color="warning">Contract has not been loaded</Alert>)}

            { (this.state.web3Proxy._erc20ContractAddress && (!this.state.isContractOwner && !this.state.isContractMinter)) && (<ListTimelocks 
                beneficiaries = {this.state.beneficiaries}
                getIntermediaryBalance = {this.getSelectedAccountBalance}
                releaseDate={this.state.timelockReleaseDate}
                onTimelock={this.handleNewTimelock}
                onRelease={this.handleRelease}
                onTransfer={this.handleTransfer}
                hasTransfered={this.hasTransfered}
                onBeneficiaryFileLoad={this.handleBeneficiaryFileLoad}
                /> 
            )}
            {(this.state.isContractOwner || this.state.isContractMinter)
                && (<Alert color="warning">Cannot be the owner or Minter</Alert>)
            }
        </div>

    );
  }
}

export default TimelockBody;