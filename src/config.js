

import ixoTokenAbi from '../build/contracts/IxoERC20Token.json'
import timelockTokenAbi from '../build/contracts/TokenTimelock.json'

import moment from 'moment';


var RELEASE_DATE_FORMAT = "DD-MM-YYYY HH:mm:ss";
var releaseDateEnv = "12-03-2019 23:59:59";
const getReleaseDate = () => {
    return releaseDateEnv
}
console.log(`releaseDateEnv: ${releaseDateEnv}`)

const isReleaseDateValid = dateTime => {
    if(!dateTime) return false
    var theMo = moment(dateTime, RELEASE_DATE_FORMAT);
    if(moment(theMo).isValid()){
        return true
    }
    return false
}

export {getReleaseDate, isReleaseDateValid, RELEASE_DATE_FORMAT, web3Fallback, ixoTokenAbi, ixoTokenAddress, benieficiaries, timelockTokenAbi};
