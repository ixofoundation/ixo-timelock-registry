// var dotenv = require('dotenv')
// const dotconfig = dotenv.config()

// if (dotconfig.error) {
//     throw dotconfig.error
// }

// console.log(dotconfig.parsed)
var network = 'ropsten';
const WEB3_DEV_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"
const WEB3_ROPSTEN_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"
const WEB3_MAINNET_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"

// const IXO_TOKEN_ABI = "src/contracts/IxoERC20Token.json"
const IXO_TOKEN_CONTRACT_ADDRESS_DEV = "0xc89ce4735882c9f0f0fe26686c53074e09b0d550"
const IXO_TOKEN_CONTRACT_ADDRESS_ROPSTEN = "0x645dd0c9f7aaff629344cd76dd8a9e26a2a39aca"
const IXO_TOKEN_CONTRACT_ADDRESS_MAINNET = ""

const TIMELOCK_REGISTRY_CONTRACT_ADDRESS_DEV = "0x0xe8e43b5d61c43375ab7b651f1419f2a81c5e6615"
const TIMELOCK_REGISTRY_CONTRACT_ADDRESS_ROPSTEN = "0xf0a36eb6e1144c0463d3ab7b6a09d0ee4b5bcf4f"
const TIMELOCK_REGISTRY_CONTRACT_ADDRESS_MAINNET = ""

var timelockRegTokenAddress = TIMELOCK_REGISTRY_CONTRACT_ADDRESS_DEV;
var ixoTokenAddress = IXO_TOKEN_CONTRACT_ADDRESS_DEV;
var web3Fallback = WEB3_DEV_FALLBACK_URL;

if(network = 'mainnet'){
    ixoTokenAddress = IXO_TOKEN_CONTRACT_ADDRESS_MAINNET
    timelockRegTokenAddress = TIMELOCK_REGISTRY_CONTRACT_ADDRESS_MAINNET
    web3Fallback = WEB3_MAINNET_FALLBACK_URL
}else if(network = 'ropsten'){
    ixoTokenAddess = IXO_TOKEN_CONTRACT_ADDRESS_ROPSTEN
    timelockRegTokenAddress = TIMELOCK_REGISTRY_CONTRACT_ADDRESS_ROPSTEN
    web3Fallback = WEB3_ROPSTEN_FALLBACK_URL
}
import ixoTokenAbi from './contracts/IxoERC20Token.json'
import timelockRegTokenAbi from './contracts/TimelockedTokenRegistry.json'

export {network, web3Fallback, ixoTokenAbi, ixoTokenAddress, timelockRegTokenAbi, timelockRegTokenAddress};
