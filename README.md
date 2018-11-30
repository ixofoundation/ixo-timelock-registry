# IXO Token Timelock dApp
This is a Reactjs web app that will load or create an IXO Token with the goal to create timelock contracts for beneficiaries

## Getting started
Ensure the Node version of at least 10.12.0 is installed

### Configuration
The configuration currently uses a config per network. Whatever network config is used in the config.js file, that is the config that will be used:

* Mainnet: src/configMainnet.js
* Ropsten: src/configRopsten.js
* Private: src/configPrivate.js

Set to Ropsten by default

The following config fields are used:
* network : The ethereum network in use
* ixoTokenOwner : The Address of the IXO Token Creator, under control of ixo.world
* intemediaryAddress : The Address of the IXO Token Intemediary, under control of Consent Global, used to create the timelocks
* minter : The Address of the IXO Token Minter (can be the same as the Creator), under control of ixo.world
* web3Fallback : Fallback infura url if meta mask is not available
* releaseDate : The release date that IXO tokens can be release format DD-MM-YYYY HH:mm:ss
* ixoTokenAddress(optional) : If the IXO token has already been created, although it can be loaded


## Scripts
* ```npm install``` to load the node_modules
* ```npm run build``` creates a product build for static serving
* ```npm run start_server``` run the dev server on port 8080
* Visit `localhost:8080` on your browser


## Build With

* WebPack
* Babel
* ReactJS
* Axios



