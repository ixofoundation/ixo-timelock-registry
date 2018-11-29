
var configJson = require('./configRopsten')

import ixoTokenAbi from '../build/contracts/IxoERC20Token.json'
import timelockTokenAbi from '../build/contracts/TokenTimelock.json'

import moment from 'moment';

var network = configJson.network;
const ixoTokenOwner = configJson.ixoTokenOwner;
const intemediaryAddress = configJson.intemediaryAddress;
var minterAddress = configJson.minter

var ixoTokenAddress = configJson.ixoTokenAddress
var web3Fallback = configJson.web3Fallback;

var RELEASE_DATE_FORMAT = "DD-MM-YYYY HH:mm:ss";
var releaseDateEnv = configJson.releaseDate;

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

export {getReleaseDate, isReleaseDateValid, RELEASE_DATE_FORMAT, network, web3Fallback, ixoTokenAbi, ixoTokenAddress, benieficiaries, timelockTokenAbi, ixoTokenOwner, intemediaryAddress, minterAddress};
