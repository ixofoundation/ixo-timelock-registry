
import React, { Component } from 'react';
import {ixoTokenAbi, ixoTokenAddress} from '../config';
import {timelockTokenAbi} from '../config';
import {network, ixoTokenOwner, isMinter, addMinter, intemediaryAddress} from '../config';
import {RELEASE_DATE_FORMAT, isReleaseDateValid, getReleaseDate} from '../config';
import {minters} from '../config';

import moment from 'moment';

import Web3Proxy from '../web3/web3-proxy';
import MintInput from './MintInput';
import CreateMinterInput from './CreateMinterInput';
import AccountInfo from './AccountInfo';
import ListTimelocks from './ListTimelocks';
import CreateIxoToken from './CreateIxoToken';
import {
    Button, Alert
  } from 'react-bootstrap';

let regeneratorRuntime =  require("regenerator-runtime");

class TimelockBody extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        correctNetwork: true,
        enteringReleaseDate: true,
        isContractOwner: false,
        isContractMinter: false,
        isIntermediary: false,
        pendingMint: false,
        pendingCreateMinter: false,
        pendingNewIxoContract: false,
        minterAddress: minters[0],
        isMinter,
        mintingTransactionQuantity: 0,
        mintingTransactionBeneficiaryAccount: '',
        web3Proxy: new Web3Proxy(
            ixoTokenAbi,
            ixoTokenAddress,
            timelockTokenAbi,
            this.handleSelectionChange,
            network
        ),
        erc20ContractAddress: ixoTokenAddress,
        newIxoToken: false,
        loadingIxoToken: false,
        balance: 0,
        lockedBalance: 0,
        beneficiaries: {},
        timelockReleaseDate: ''
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
                this.setState({correctNetwork: false});
            }

        })
    };

    initialize = () => {
        
        this.state.web3Proxy.getNetwork().then(network => {
            const isContractOwner = this.state.web3Proxy.getSelectedAccount() === ixoTokenOwner;
            const isContractMinter = this.state.isMinter(this.state.web3Proxy.getSelectedAccount());
            const isIntermediary = this.state.web3Proxy.getSelectedAccount() === intemediaryAddress;
            var balance =  0
            if (this.state.erc20ContractAddress){
                balance = this.getBalance(this.state.web3Proxy.getSelectedAccount());
            }
            var lockedBalance = 0
            if(this.state.beneficiaries){
                var timelock = this.state.beneficiaries[this.state.web3Proxy.getSelectedAccount()]
                if(timelock && timelock.timelockAddress){
                    lockedBalance =  this.getBalance(timelock.timelockAddress);
                }
            }
            
            Promise.all([balance, lockedBalance]).then((values) => {
                
                this.setState({ 
                    balance : values[0]?values[0]:0, 
                    lockedBalance: values[1]?values[1]:0, 
                    isContractOwner,
                    isContractMinter, 
                    isIntermediary,
                    beneficiaries: this.state.beneficiaries?this.state.beneficiaries:{},
                    loading: false,
                    timelockReleaseDate: getReleaseDate(),
                    enteringReleaseDate: getReleaseDate()?false:true,
                    beneficiariesFile: '',
                    correctNetwork: true
                });                
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
        this.setState({loadingIxoToken: false });

        
    }

    handleCreateIxoToken = () => {
        this.setState({pendingNewIxoContract: true})
        this.state.web3Proxy
        .createIxoTokenContract()
        .then(ixoTokenAddress => {
            this.setState({ erc20ContractAddress: ixoTokenAddress, newIxoToken: true});
        })
        .catch(error => {
            console.log(`error: ${error}`);
            this.setState({pendingNewIxoContract: false, newIxoToken: false})
        });
        
    }

 
    handleCreateMinter = (minter) => {
        console.log(`handleCreateMinter: ${minter}`)
        this.setState({pendingCreateMinter: true})
        this.state.web3Proxy
        .setMinter(minter)
        .then(txHash => {
            console.log(`TX: ${txHash}`);
            if(minter === this.state.web3Proxy.getSelectedAccount()){
                this.setState({isContractMinter: true})
            }
            addMinter(minter)
        })
        .catch(error => {
            console.log(`error: ${error}`);
        });
	};

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
            handleTransferComplete(timelockAddress)
        }).catch(error => {
            console.log(`error: ${error}`);
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
    if(!this.state.loading && !this.state.web3Proxy.getSelectedAccount()){
        return <Alert color="danger">Please unlock your Metamask</Alert>
    }
    if(!this.state.correctNetwork){
        return <Alert color="danger">Please change to the {this.state.web3Proxy.getDefaultNetwork()} network</Alert>
    }
    return ( 
      <div>
        
        { (this.state.isContractOwner && !this.state.loadingIxoToken && !this.state.newIxoToken && this.state.erc20ContractAddress) && (<CreateMinterInput 
            minterAddress={this.state.minterAddress}
            handleMinterAddressChange={this.handleMinterTransactionAddressChange}
            handleCreateMinter={this.handleCreateMinter}
            pendingCreateMinter={this.state.pendingCreateMinter}
        /> 
        )}
         { (this.state.isContractOwner && (this.state.loadingIxoToken || !this.state.erc20ContractAddress)) && (<CreateIxoToken 
             handleCreateIxoToken={this.handleCreateIxoToken}
             handleLoadIxoToken={this.handleLoadIxoToken}
             handleIxoTokenAddressChange={this.handleIxoTokenAddressChange}
             pendingNewIxoContract={this.state.pendingNewIxoContract}

        />
        )}
        {(this.state.isContractOwner && this.state.newIxoToken && this.state.erc20ContractAddress) && (
            <div>
                <Alert color="success">New IXO Token Address</Alert>
                <Alert color="secondary"><span fontWeight="bold" >{this.state.erc20ContractAddress}</span></Alert>
                <div><span fontWeight="bold" >Save this address to a secure location, press Done when you have</span></div>
                <div><span fontWeight="bold" >The Address can be used later to load the Token</span></div>
                <Button onClick={() => {this.setState({newIxoToken: false})}}>Done</Button>
            </div>
        )}
        { (this.state.isContractMinter && !this.state.pendingCreateMinter) && (<MintInput 
            quantity={this.state.mintingTransactionQuantity}
            handleQuantityChange={this.handleMintingTransactionQuantityChange}
            beneficiaryAddress={this.state.mintingTransactionBeneficiaryAccount}
            handleBeneficiaryAddressChange={this.handleMintingTransactionBeneficiaryAddressChange}
            handleTokenMinting={this.handleTokenMinting}
            pending={this.state.pendingMint}
        /> 
        )}
        { (this.state.isIntermediary && this.state.enteringReleaseDate) && (
            <form onSubmit={this.handleReleaseDateSubmit}>
                <h2>Set Release Date Time</h2>
                <div className="row">
                    <div className="form-group col-md-4">
                        <input type="text"  onChange={this.handleReleaseDateChange} className="form-control" placeholder="DD-MM-YYY HH:mm:ss"/>
                    </div>
                </div>
                <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
            </form>
        )}
        { (this.state.isIntermediary && this.state.timelockReleaseDate && !this.state.enteringReleaseDate) && (<ListTimelocks 
            beneficiaries = {this.state.beneficiaries}
            releaseDate={this.state.timelockReleaseDate}
            onTimelock={this.handleNewTimelock}
            onRelease={this.handleRelease}
            onTransfer={this.handleTransfer}
            onBeneficiaryFileLoad={this.handleBeneficiaryFileLoad}
            /> 
        )}
        {(!this.state.loading && !this.state.isContractOwner && !this.state.isContractMinter && !this.state.isIntermediary)
            && (<AccountInfo balance={this.state.balance} lockedBalance={this.state.lockedBalance}/>)
        }
      </div>

    );
  }
}

export default TimelockBody;