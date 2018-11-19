
import React, { Component } from 'react';
import {ixoTokenAbi, ixoTokenAddress} from '../config';
import {timelockTokenAbi} from '../config';
import {network, ixoTokenOwner, isMinter, addMinter, intemediaryAddress} from '../config';
import {RELEASE_DATE_FORMAT, isReleaseDateValid, configuredReleaseDate} from '../config';
import {minters} from '../config';

import moment from 'moment';

import Web3Proxy from '../web3/web3-proxy';
import MintInput from './MintInput';
import CreateMinterInput from './CreateMinterInput';
import AccountInfo from './AccountInfo';
import ListTimelocks from './ListTimelocks';

let regeneratorRuntime =  require("regenerator-runtime");

class TimelockBody extends Component {
 
  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        enteringReleaseDate: true,
        isContractOwner: false,
        isContractMinter: false,
        isIntermediary: false,
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
        balance: 0,
        lockedBalance: 0,
        beneficiaries: {},
        timelockReleaseDate: ''
    };
}


    componentWillMount() {
        if(this.state.web3Proxy.getSelectedAccount()){
            this.initialize();
        }
        
    }

    handleSelectionChange = () => {
        if(this.state.web3Proxy.getSelectedAccount()){
            this.initialize();
        }
    };

    initialize = () => {
        this.state.web3Proxy.getNetwork().then(network => {
            const isContractOwner = this.state.web3Proxy.getSelectedAccount() === ixoTokenOwner;
            const isContractMinter = this.state.isMinter(this.state.web3Proxy.getSelectedAccount());
            const isIntermediary = this.state.web3Proxy.getSelectedAccount() === intemediaryAddress;
            var balance =  this.getBalance(this.state.web3Proxy.getSelectedAccount());
            var lockedBalance = 0
            if(this.state.beneficiaries){
                var timelock = this.state.beneficiaries[this.state.web3Proxy.getSelectedAccount()]
                if(timelock && timelock.timelockAddress){
                    lockedBalance =  this.getBalance(timelock.timelockAddress);
                }
            }
            Promise.all([balance, lockedBalance]).then((values) => {
                
                this.setState({ 
                    balance : values[0], 
                    lockedBalance: values[1], 
                    isContractOwner,
                    isContractMinter, 
                    isIntermediary,
                    beneficiaries: this.state.beneficiaries?this.state.beneficiaries:{},
                    loading: false,
                    timelockReleaseDate: configuredReleaseDate?configuredReleaseDate:'',
                    enteringReleaseDate: configuredReleaseDate?false:true,
                    beneficiariesFile: ''
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
		this.setState({ minterTransactionAccount: event.target.value });
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


    handleTokenMinting = event => {
		if (this.state.mintingTransactionBeneficiaryAccount && this.state.mintingTransactionQuantity > 0) {
			this.state.web3Proxy
            .mintTo(this.state.mintingTransactionBeneficiaryAccount, this.state.mintingTransactionQuantity * 100000000)
            .then(txHash => {
                console.log(`TX: ${txHash}`);
                this.setState({ mintingTransactionBeneficiaryAccount: '', mintingTransactionQuantity: 0 });
            })
            .catch(error => {
                console.log(`error: ${error}`);
            });
		}
    };
    
    handleCreateMinter = event => {
        console.log(this.state)
		if (this.state.minterTransactionAccount) {
			this.state.web3Proxy
            .setMinter(this.state.minterTransactionAccount)
            .then(txHash => {
                console.log(`TX: ${txHash}`);
                addMinter(this.state.minterTransactionAccount)
                this.setState({ minterTransactionAccount: '' });
            })
            .catch(error => {
                console.log(`error: ${error}`);
            });
		}
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

    handleTransfer = (timelockAddress, amount, handleTransfer) => {
        this.state.web3Proxy
        .transferTo(timelockAddress, amount)
        .then(txHash => {
            console.log(`TX: ${txHash}`);
            handleTransfer(timelockAddress)
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
            for(var line = 0; line < lines.length; line++){
                var lineString = lines[line];

                var splitLine = lineString.split(",")
                if (splitLine && splitLine.length > 2){
                    var address = splitLine[0];
                    var name = splitLine[1];
                    var amount = parseInt(splitLine[2].trim(), 10);
                    var timelockAddress
                    if (splitLine.length > 2){
                        timelockAddress = splitLine[3]
                        if (timelockAddress){
                            timelockAddress = timelockAddress.replace(/\r?\n|\r/, "")
                        }
                    }
    
                    beneficiaries[address] = {
                        address,
                        name,
                        amount,
                        timelockAddress
                    }
                }
            }
            if (beneficiaries && Object.entries(beneficiaries).length > 0){
                this.setState({beneficiaries, beneficiariesFile: file})
            }
        };
        reader.readAsText(file);
    }
  
    getCurrentDateTime = () => {
        return moment().format(RELEASE_DATE_FORMAT);
    }

    handleReleaseDateSubmit = (e) => {
        e.preventDefault();
        if(isReleaseDateValid(this.state.timelockReleaseDate)){
            this.setState({enteringReleaseDate: false})
            this.writeToDotEnv()
        }else{
            console.log(`releaseDate: ${this.state.timelockReleaseDate}`)
        }
    }

    handleReleaseDateChange = (e) => {
        this.setState({timelockReleaseDate: e.target.value})
    }

    writeToDotEnv= () => {
        this.state.timelockReleaseDate
        var envFile = ".env";
        var file = new File(envFile);
        var str = 'TIME_RELEASE_DATE="11-12-2018 23:59:59"';

        file.open("w"); // open file with write access
        file.write(str);
        file.close();
    }

  render() {
    if(!this.state.loading && !this.state.web3Proxy.getSelectedAccount()){
        return <h4>Please unlock your Metamask</h4>
    }
    return ( 
      <div>
        
        { this.state.isContractOwner && (<CreateMinterInput 
            minterAddress={this.state.minterAddress}
            handleMinterAddressChange={this.handleMinterTransactionAddressChange}
            handleCreateMinter={this.handleCreateMinter}
        /> 
        )}
        { this.state.isContractMinter && (<MintInput 
            quantity={this.state.mintingTransactionQuantity}
            handleQuantityChange={this.handleMintingTransactionQuantityChange}
            beneficiaryAddress={this.state.mintingTransactionBeneficiaryAccount}
            handleBeneficiaryAddressChange={this.handleMintingTransactionBeneficiaryAddressChange}
            handleTokenMinting={this.handleTokenMinting}
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
            retrieveLockedBalance={this.getBalance}
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