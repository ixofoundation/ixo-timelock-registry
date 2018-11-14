import Web3 from 'web3';
import networks from './networks';

class Web3Proxy {
	constructor(
		erc20ContractAbiJson,
		erc20ContractAddress,
		timelockRegistryContractAbiJson,
		timelockRegistryContractAddress,
		selectionChangeHandler,
		defaultNetwork = networks.MAIN_NETWORK
	) {
		this._selectedAccount = '';
		this._erc20ContractAbiJson = erc20ContractAbiJson;
		this._erc20ContractAddress = erc20ContractAddress;
		this._timelockRegistryContractAbiJson = timelockRegistryContractAbiJson;
		this._timelockRegistryContractAddress = timelockRegistryContractAddress;
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
		this._erc20Contract = new this._web3.eth.Contract(this._erc20ContractAbiJson, this._erc20ContractAddress);
		this._timelockRegistryContract = new this._web3.eth.Contract(this._timelockRegistryContractAbiJson, this._timelockRegistryContractAddress);
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
				.call({
					from: account
				})
				.then(result => {
					resolve(result);
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
				.transfer(beneficiaryAddress, amount)
				.send({
					from: this._selectedAccount
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('error', error => {
					reject(error);
				});
		});
	};

	setMinter = mintingAddress => {
		const contract = this._erc20Contract;

		return new Promise((resolve, reject) => {
			contract.methods
				.setMinter(mintingAddress)
				.send({
					from: mintingAddress
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('error', error => {
					reject(error);
				})
				.on('receipt', function (receipt) {
					console.log(receipt.contractAddress); // contains the new contract address
				});
		});
	};

	mintTo = (beneficiaryAddress, amount) => {
		const contract = this._erc20Contract;

		return new Promise((resolve, reject) => {
			contract.methods
				.mint(beneficiaryAddress, amount)
				.send({
					from: this._selectedAccount
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('error', error => {
					reject(error);
				})
				.on('receipt', function (receipt) {
					console.log(receipt.contractAddress); // contains the new contract address
				});
		});
	};

	addTimelock = (benificiary, releaseTime) => {
		const contract = this._timelockRegistryContract;

		return new Promise((resolve, reject) => {
			contract.methods
				.addNewTimelock(benificiary, releaseTime)
				.send({
					from: this._selectedAccount
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('receipt', receipt => {
					console.log(JSON.stringify(receipt)); // contains the new contract address
				})
				.on('error', error => {
					reject(error);
				})
		});
    };
    
    releaseForBenificiary = (benificiary) => {
		const contract = this._timelockRegistryContract;

		return new Promise((resolve, reject) => {
			contract.methods
				.releaseForBenificiary(benificiary)
				.send({
					from: this._selectedAccount
				})
				.on('transactionHash', hash => {
					resolve(hash);
				})
				.on('receipt', receipt => {
					console.log(JSON.stringify(receipt)); // contains the new contract address
				})
				.on('error', error => {
					reject(error);
				})
		});
	};

	balanceOfTimelock = (benificiary) => {
		const contract = this._timelockRegistryContract;

		return new Promise((resolve, reject) => {
			contract.methods
				.lockedBalance(benificiary)
				.call({
					from: this._selectedAccount
				})
				.then(result => {
					resolve(result);
				})
				.catch(error => {
					reject(error);
				})
		});
	};
}
export default Web3Proxy;
