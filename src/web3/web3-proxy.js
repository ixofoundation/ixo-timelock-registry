import Web3 from 'web3';
import networks from './networks';

class Web3Proxy {
	constructor(
		erc20ContractAbiJson,
        erc20ContractAddress,
        timelockTokenAbi,        
		selectionChangeHandler,
		defaultNetwork = networks.ROPSTEN_NETWORK
	) {
		this._selectedAccount = '';
		this._erc20ContractAbiJson = erc20ContractAbiJson.abi;
		this._erc20ContractAddress = erc20ContractAddress;
        this._timelockTokenAbi = timelockTokenAbi.abi;
        this._timelockTokenData = timelockTokenAbi.bytecode;
        this._ixoTokenData = erc20ContractAbiJson.bytecode;

		this._selectionChangeHandler = selectionChangeHandler;
		this._defaultNetwork = defaultNetwork;

		const {
			web3
		} = window;
		if (web3) {
			this._web3old = window.web3;
			this.initWithCurrentProvider(web3.currentProvider);
		}
	}

	initWithCurrentProvider = provider => {
        this._web3 = new Web3(provider);
        if(this._erc20ContractAddress){
            this._erc20Contract = new this._web3.eth.Contract(this._erc20ContractAbiJson, this._erc20ContractAddress);
        }else{
            this._erc20Contract = new this._web3.eth.Contract(this._erc20ContractAbiJson);
        }
		this._timelockContract = new this._web3.eth.Contract(this._timelockTokenAbi);
        
        this._accountPollInterval = setInterval(() => {
			this._pollForAccount();
		}, 100);
	};

	_pollForAccount = () => {
		this._web3.eth.getAccounts().then(accounts => {
			let account = accounts.length > 0 ? accounts[0] : undefined;
			if (account !== this._selectedAccount) {
				this._selectedAccount = account;
				this._selectionChangeHandler();
			}
		});
    };
    
    

	getSelectedAccount = () => {
		return this._selectedAccount;
	};

	getAccounts = () => {
		return this._web3.eth.getAccounts();
	};

	getBalance = account => {

		const contract = this._erc20Contract;
		return new Promise((resolve, reject) => {
			contract.methods
				.balanceOf(account)
				.call()
				.then(result => {
                    console.log(`getBalance balance : ${result}`)

					resolve(result/100000000);
				})
				.catch(error => {
        console.log(`getBalance error : ${error}`)

					reject(error);
				});
		});
    };

    getBalance = () => {

		const contract = this._erc20Contract;
		return new Promise((resolve, reject) => {
			contract.methods
				.balanceOf(this.getSelectedAccount())
				.call()
				.then(result => {
                    console.log(`getBalance balance : ${result}`)
					resolve(result/100000000);
				})
				.catch(error => {
					reject(error);
				});
		});
    };
    
    getCurrentMinter = () => {

		const contract = this._erc20Contract;
		return new Promise((resolve, reject) => {
			contract.methods
				.minter()
				.call()
				.then(minter => {
					resolve(minter);
				})
				.catch(error => {
					reject(error);
				});
		});
	};

	getDefaultAccount = () => {
		return this._web3.eth.defaultAccount;
	};

	setDefaultAccount = account => {
		this._web3.eth.defaultAccount = account;
	};

	getNetwork = () => {
		return this._web3.eth.net.getNetworkType();
	};

	getDefaultNetwork = () => {
		return this._defaultNetwork;
	};

	setDefaultNetwork = defaultNetwork => {
		this._defaultNetwork = defaultNetwork;
	};

	isDesiredNetwork = () => {
		const defaultNetwork = this._defaultNetwork;
		return this._web3.eth.net.getNetworkType().then(network => {
			return new Promise(resolve => resolve(defaultNetwork === network));
		});
	};

	transferTo = (beneficiaryAddress, amount) => {
		const contract = this._erc20Contract;

		return new Promise((resolve, reject) => {
			contract.methods
				.transfer(beneficiaryAddress, amount* 100000000)
				.send({
                    from: this._selectedAccount,
                    gas: 3500000,
                    gasPrice: '20000000000'
				})
				.on('transactionHash', hash => {
					console.log(hash); // contains the new contract address
				})
				.on('error', error => {
					reject(error);
				}).on('receipt', receipt => {
                    resolve(receipt.transactionHash) // contains the new contract address
                })
		});
	};

	setMinter = mintingAddress => {
		const contract = this._erc20Contract;
        console.log(`minting address: ${mintingAddress}`)
        console.log(`token address: ${this._erc20ContractAddress}`)

		return new Promise((resolve, reject) => {
			contract.methods
				.setMinter(mintingAddress)
				.send({
                    from: this._selectedAccount,
                    gas: 3500000,
                    gasPrice: '20000000000'
				})
				.on('transactionHash', hash => {
					console.log(hash); // contains the new contract address
                    
				})
				.on('error', error => {
					reject(error);
				})
				.on('receipt', function (receipt) {
					resolve(receipt);

					console.log(receipt); // contains the new contract address
				});
		});
	};

	mintTo = (beneficiaryAddress, amount) => {
		const contract = this._erc20Contract;

		return new Promise((resolve, reject) => {
			contract.methods
				.mint(beneficiaryAddress, amount)
				.send({
                    from: this._selectedAccount,
                    gas: 3500000,
                    gasPrice: '20000000000'
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('error', error => {
					reject(error);
				})
				.on('receipt', receipt => {
					console.log(receipt.contractAddress); // contains the new contract address
				});
		});
	};

    loadIxoTokenContract = (address) => {
        this._erc20ContractAddress = address
        this._erc20Contract = new this._web3.eth.Contract(this._erc20ContractAbiJson, this._erc20ContractAddress);
    }

    createIxoTokenContract = () => {
        const ixoTokenContract = this._erc20Contract;
        var setIxoTockenAddress = (address) => {this._erc20ContractAddress = address} 
        return new Promise((resolve, reject) => {

            ixoTokenContract.deploy({
                data: this._ixoTokenData, arguments: {}
            })
            .send({
                from: this._selectedAccount,
                gas: 3500000,
                gasPrice: '20000000000'
            })
            .on('error', error => { 
                reject(error);
            })
            .on('transactionHash', hash => {
                console.log(hash);
            })
            .on('receipt', receipt => {
                setIxoTockenAddress(receipt.contractAddress)
                resolve(receipt.contractAddress) // contains the new contract address
            })
		});

    }
    createNewTimeLockContract = (beneficiaryAddress, releaseTime) => {
        const timelockContract = new this._web3.eth.Contract(this._timelockTokenAbi);
        console.log(this._timelockTokenData);
		return new Promise((resolve, reject) => {

            timelockContract.deploy({
                data: this._timelockTokenData,
                arguments: [this._erc20ContractAddress, beneficiaryAddress, releaseTime]
            })
            .send({
                from: this._selectedAccount,
                gas: 3500000,
                gasPrice: '20000000000'
            })
            .on('error', error => { 
                console.log(JSON.stringify(error.message))
                reject(error);
            })
            .on('transactionHash', hash => {
                console.log(hash);
            })
            .on('receipt', receipt => {
                resolve(receipt.contractAddress) // contains the new contract address
            })
		});

    }
}
export default Web3Proxy;
