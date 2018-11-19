pragma solidity ^0.4.24;
import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

    /**
    * @title TimelockedTokenRegistry
    */

contract TimelockedTokenRegistry is Initializable {
    using SafeMath for uint256;

    IERC20 private ixoToken;
    uint256 public nrBenificiaries;
    address[] benificiaries;
    //Only A spcific address can set these tokens - prevent other token from being timelocked
    mapping (address => address) private benificiaryTimelocks;
    event TimelockedRegistryCreated(address indexed ixoToken);
    event TimeLockAdded(address indexed beneficiary, address indexed timelockAddress);  
    event TimeLockCreated(address indexed token, address indexed timelockAddress);         
    event TokensReleased(address indexed token, address indexed to, uint256 value);

    function initialize(address _ixoToken) public {
        ixoToken = IERC20(_ixoToken);
        nrBenificiaries = 0;
        emit TimelockedRegistryCreated(address(ixoToken));
    }

    function getNrOfBenificiaries() public view returns(uint256){
        return nrBenificiaries;
    }

    function releaseForBenificiary(address _beneficiary) public {
        // solium-disable-next-line security/no-block-members
        require(benificiaryTimelocks[_beneficiary] > 0, "No Address found");         
        TokenTimelock timelock = TokenTimelock(benificiaryTimelocks[_beneficiary]);
        timelock.release();
        benificiaryTimelocks[_beneficiary] = 0;
        delete timelock;
        emit TokensReleased(address(ixoToken), _beneficiary, ixoToken.balanceOf(_beneficiary));
    }

    function addNewTimelock(address _beneficiary, uint256 _releaseTime) public {
        require(_beneficiary != address(0), "Beneficiary cannot be zero");
        require(benificiaryTimelocks[_beneficiary] == 0, "Address added already");   
        TokenTimelock timelock = new TokenTimelock(ixoToken, _beneficiary, _releaseTime);
        // solium-disable-next-line security/no-low-level-calls
        //address(timelock).delegatecall(bytes4(keccak256("addTimelock(address,address)")), _beneficiary, address(timelock));
        emit TimeLockCreated(address(ixoToken), address(timelock));
        addTimelock(_beneficiary, address(timelock));
    }

    function addTimelock(address _beneficiary, address timelock) public{
        require(_beneficiary != address(0), "Beneficiary cannot be zero");   
        require(timelock != address(0), "Timelock cannot be zero");   
        require(benificiaryTimelocks[_beneficiary] == 0, "Address added already");   
        benificiaryTimelocks[_beneficiary] = address(timelock);
        nrBenificiaries = nrBenificiaries.add(1);
        benificiaries.push(_beneficiary);
        emit TimeLockAdded(_beneficiary, address(timelock));
    }

    function getBenificiary(uint256 index) public view returns (address){
        if(index < nrBenificiaries){
            return benificiaries[index];
        }else{
            return address(0);
        }
    }

    function getTimelock(address _beneficiary) public view returns (address){
        return benificiaryTimelocks[_beneficiary];
    }

    function transferToTimelock(address _beneficiary, uint256 _value) public {
        require(_beneficiary != address(0), "Beneficiary cannot be zero");   
        require(benificiaryTimelocks[_beneficiary] != 0, "Address does not exist");   
        require(_value > 0, "Value must be more that zero");   
        ixoToken.transfer(benificiaryTimelocks[_beneficiary], _value);
    }

    function getReleaseTime(address _beneficiary) public view returns (uint256){
        if (benificiaryTimelocks[_beneficiary] == 0 ){
            return 0;
        }
        return TokenTimelock(benificiaryTimelocks[_beneficiary]).releaseTime();
    }

     /**
    * @return the nr of tokens locked for the beneficiary.
    */
    function lockedBalance(address _beneficiary) public view returns(uint256) {
        if (benificiaryTimelocks[_beneficiary] == 0 ) {
            return 0;  
        }    
        address timelockAddress = benificiaryTimelocks[_beneficiary];
        return TokenTimelock(timelockAddress).token().balanceOf(timelockAddress);
    }

}