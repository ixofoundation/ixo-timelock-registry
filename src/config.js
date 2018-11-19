// var dotenv = require('dotenv')
// const dotconfig = dotenv.config()

// if (dotconfig.error) {
//     throw dotconfig.error
// }

// console.log(dotconfig.parsed)
// require('dotenv').config()
import moment from 'moment';

var network = 'ropsten';
const ixoTokenOwner = "0x00cd126784792412be40795b2E8Bb4Fb5Aa4b19d"
const intemediaryAddress = "0xb23913B6eC2C50dF8bF70F9758505DF34Ff50d36"
var minters = ["0xd436B44841Ef86B103bdfbb7e69C217a3Fd0c78c"]

//FALLBACK
const WEB3_DEV_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"
const WEB3_ROPSTEN_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"
const WEB3_MAINNET_FALLBACK_URL = "https://ropsten.infura.io/v3/109382c3b8ed4f2cbab2f0d5cceb629a"

//IXO Token
const IXO_TOKEN_CONTRACT_ADDRESS_DEV = "0xc89ce4735882c9f0f0fe26686c53074e09b0d550"
const IXO_TOKEN_CONTRACT_ADDRESS_ROPSTEN = "0x645dd0c9f7aaff629344cd76dd8a9e26a2a39aca"
const IXO_TOKEN_CONTRACT_ADDRESS_MAINNET = ""


var ixoTokenAddress = IXO_TOKEN_CONTRACT_ADDRESS_DEV;
var web3Fallback = WEB3_DEV_FALLBACK_URL;

if(network === 'mainnet'){
    ixoTokenAddress = IXO_TOKEN_CONTRACT_ADDRESS_MAINNET
    web3Fallback = WEB3_MAINNET_FALLBACK_URL
}else if(network === 'ropsten'){
    ixoTokenAddress = IXO_TOKEN_CONTRACT_ADDRESS_ROPSTEN
    web3Fallback = WEB3_ROPSTEN_FALLBACK_URL
}
import ixoTokenAbi from '../build/contracts/IxoERC20Token.json'
import timelockTokenAbi from '../build/contracts/TokenTimelock.json'


const isMinter = address => {
    return minters.indexOf(address) >= 0
}

const addMinter = address => {
    if(minters.indexOf(address) < 0){
        minters.push(address);
    }
}
///nned to get release date time
var RELEASE_DATE_FORMAT = "DD-MM-YYYY HH:mm:ss";
var releaseDateEnv = process.env.TIME_RELEASE_DATE
var configuredReleaseDate
console.log(`releaseDateEnv: ${releaseDateEnv}`)
const isReleaseDateValid = dateTime => {
    var theMo = moment(dateTime, RELEASE_DATE_FORMAT);
    if(moment(theMo).isValid()){
        return true
    }
    return false
}
if (isReleaseDateValid(releaseDateEnv)){
    configuredReleaseDate = releaseDateEnv
}
export {configuredReleaseDate, RELEASE_DATE_FORMAT, isReleaseDateValid, network, web3Fallback, ixoTokenAbi, ixoTokenAddress,benieficiaries, timelockTokenAbi, ixoTokenOwner, intemediaryAddress, isMinter, addMinter, minters};


//deploy new ixo token?
// or use from config or load from file (fill in if file present)
//load beneficiaries from file - if file present then load them in
//add new and save?
// table has:
//create timelock - saves address
// Transfer
//Release

//csv file: beneficiary, amount, timelock, transfered
//enter Release Date