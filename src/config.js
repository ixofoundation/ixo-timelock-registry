
var configJson = require('./configRopsten')

import ixoTokenAbi from '../build/contracts/IxoERC20Token.json'
import timelockTokenAbi from '../build/contracts/TokenTimelock.json'

import moment from 'moment';

var network = configJson.network;
const ixoTokenOwner = configJson.ixoTokenOwner;
const intemediaryAddress = configJson.intemediaryAddress;
var minters = [configJson.minter]

var ixoTokenAddress = configJson.ixoTokenAddress
var web3Fallback = configJson.web3Fallback;

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
var releaseDateEnv = configJson.releaseDate;
var configuredReleaseDate

// const getReleaseDate = () => {
//     if(!configuredReleaseDate){
//         return isReleaseDateValid(configJson.releaseDate)?configJson.releaseDate:null
//     }else{
//         return configuredReleaseDate
//     }
// }
const getReleaseDate = () => {
    return releaseDateEnv
}
console.log(`releaseDateEnv: ${releaseDateEnv}`)
console.log(`ixoTokenAddress: ${ixoTokenAddress}`)

const isReleaseDateValid = dateTime => {
    if(!dateTime) return false
    var theMo = moment(dateTime, RELEASE_DATE_FORMAT);
    if(moment(theMo).isValid()){
        return true
    }
    return false
}

export {getReleaseDate, isReleaseDateValid, RELEASE_DATE_FORMAT, network, web3Fallback, ixoTokenAbi, ixoTokenAddress, benieficiaries, timelockTokenAbi, ixoTokenOwner, intemediaryAddress, isMinter, addMinter, minters};
