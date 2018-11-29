import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import '../App.css';
import TimelockBody from './TimelockBody';
import IxoTokenSetup from './IxoTokenSetup';
import MintIxo from './MintIxo';
import CreateMinter from './CreateMinterInput';

import {ixoTokenAbi, ixoTokenAddress} from '../config';
import {timelockTokenAbi} from '../config';
import {network, ixoTokenOwner,minterAddress,intemediaryAddress} from '../config';
import {RELEASE_DATE_FORMAT, getReleaseDate} from '../config';
import Web3Proxy from '../web3/web3-proxy';
let regeneratorRuntime =  require("regenerator-runtime");
import {
    Alert
  } from 'react-bootstrap';
 

class IxoTimelockApp extends Component {

    constructor(props) {
        super(props);
        var localIxoTokenStorage = localStorage.getItem('erc20ContractAddress');
        console.log(`erc20ContractAddress : ${localIxoTokenStorage}`)
        this.state = {
            loading: true,
            correctNetwork: true,
            isContractOwner: false,
            isContractMinter: false,
            isIntermediary: false,
            mintingTransactionQuantity: 0,
            mintingTransactionBeneficiaryAccount: '',
            pendingMint: false,
            minterAddress: minterAddress,
            pendingMint: false,
            pendingCreateMinter: false,
            web3Proxy: new Web3Proxy(
                ixoTokenAbi,
                localIxoTokenStorage?localIxoTokenStorage:ixoTokenAddress,
                timelockTokenAbi,
                this.handleSelectionChange,
                network
            ),
        };
    }

    componentWillMount() {

        this.state.web3Proxy.isDesiredNetwork().then((correct) => {
            if(correct){
                this.initialize();
            }else if(this.state.web3Proxy.getSelectedAccount()){
                this.setState({correctNetwork: false});
            }
        })
    }

    handleSelectionChange = () => {

        this.state.web3Proxy.isDesiredNetwork().then((correct) => {
            if(correct){
                this.initialize();
            }else{
                this.setState({correctNetwork: false, loading: false});
            }

        })
    };

    initialize = () => {
        
        this.state.web3Proxy.getNetwork().then(network => {
            const isContractOwner = this.state.web3Proxy.getSelectedAccount() === ixoTokenOwner;
            const isContractMinter = this.state.web3Proxy.getSelectedAccount() === minterAddress; 
            const isIntermediary = this.state.web3Proxy.getSelectedAccount() === intemediaryAddress; 

            this.setState({ 
                isContractOwner,
                isContractMinter, 
                isIntermediary,
                loading: false,
                mintingTransactionQuantity: 0,
                mintingTransactionBeneficiaryAccount: '',
                pendingMint: false,
                timelockReleaseDate: getReleaseDate(),
                correctNetwork: true
            });                
        });
    };

    getDefaultAccount = () => {
        const account = this.state.web3Proxy.getDefaultAccount();
        console.log(account ? account : 'not set');
    };

    setDefaultAccount = () => {
        this.state.web3Proxy.getAccounts().then(accounts => {
            const account = accounts.length > 0 ? accounts[0] : 'no account';
            this.state.web3Proxy.setDefaultAccount(account);
        });
    };

    getAccount = () => {
        console.log(this.state.web3Proxy.getSelectedAccount());
    };

    getAccounts = () => {
        this.state.web3Proxy.getAccounts().then(accounts => {
            console.log(JSON.stringify(accounts));
        });
    };

    getBalance = async (account) => {

        return this.state.web3Proxy
        .getBalance(account)
        .then(balance => {
            return balance;
        })
        .catch(console.error);
    };

    calculateTimeLeft = (releaseTime) => {
        var current = Math.floor(new Date().getTime()/1000);
        return (releaseTime > current)? releaseTime - current:0
    }

   
    getCurrentDateTime = () => {
        return moment().format(RELEASE_DATE_FORMAT);
    }

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
    
    handleMintingTransactionQuantityChange = event => {
		this.setState({ mintingTransactionQuantity: parseInt(event.target.value) });
	};

	handleMintingTransactionBeneficiaryAddressChange = event => {
		this.setState({ mintingTransactionBeneficiaryAccount: event.target.value });
    };

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

    handleCreateMinter = () => {
        console.log(`handleCreateMinter: ${this.state.minterAddress}`)
        this.setState({pendingCreateMinter: true})
        this.state.web3Proxy
        .setMinter(this.state.minterAddress)
        .then(txHash => {
            console.log(`TX: ${txHash}`);
            if(this.state.minterAddress === this.state.web3Proxy.getSelectedAccount()){
                this.setState({isContractMinter: true, pendingCreateMinter: false})
            }
            //addMinter(minter)
        })
        .catch(error => {
            console.log(`error: ${error}`);
            this.setState({pendingCreateMinter: false})
        });
    };
    
    handleGetCurrentMinter = () => {
		return new Promise((resolve, reject) => {
            this.state.web3Proxy
            .getCurrentMinter()
            .then(minter => {
                resolve(minter)
            })
            .catch(error => {
                reject(error)
            });
        })
	};


    render() {
        if(!this.state.loading && !this.state.web3Proxy.getSelectedAccount()){
            return <Alert color="danger">Please unlock your Metamask</Alert>
        }
        if(!this.state.loading && !this.state.correctNetwork){
            return <Alert color="danger">Please change to the {this.state.web3Proxy.getDefaultNetwork()} network</Alert>
        }

        return (
            <Switch>
                {/* <Route exact path='/' component={Home}/> */}
                <Route path='/ixoTokenSetup' render={(props) => <IxoTokenSetup {...props} 
                    web3Proxy={this.state.web3Proxy} 
                    isContractOwner={this.state.isContractOwner} 
                    isContractMinter={this.state.isContractMinter} 
                    isIntermediary={this.state.isIntermediary}
                />}/>
                <Route path='/setMinter' render={(props) => <CreateMinter {...props} 
                    isContractOwner={this.state.isContractOwner}
                    isIntermediary={this.state.isIntermediary}
                    handleMinterAddressChange={this.handleMinterTransactionAddressChange}
                    handleCreateMinter={this.handleCreateMinter}
                    pendingCreateMinter={this.state.pendingCreateMinter}
                    handleGetCurrentMinter={this.handleGetCurrentMinter}
                />}/>
                <Route path='/mintIxoToken'  render={(props) => <MintIxo {...props} 
                    handleQuantityChange={this.handleMintingTransactionQuantityChange}
                    handleBeneficiaryAddressChange={this.handleMintingTransactionBeneficiaryAddressChange}
                    handleTokenMinting={this.handleTokenMinting}
                    isContractMinter={this.state.isContractMinter} 
                    isIntermediary={this.state.isIntermediary}
                    pending={this.state.pendingMint}
                    />}/>
                <Route path='/timelock'  render={(props) => <TimelockBody {...props} 
                    web3Proxy={this.state.web3Proxy} 
                    isContractOwner={this.state.isContractOwner} 
                    isContractMinter={this.state.isContractMinter} 
                    isIntermediary={this.state.isIntermediary}
                />}/>
            </Switch>
            
        );
    } 
}


export default IxoTimelockApp;